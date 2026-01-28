import psycopg2
import requests
import json
import redis
from fastapi import FastAPI, HTTPException, Form
import os
import urllib3
import jwt
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Параметры подключения из окружения
DB_HOST = os.getenv("DB_HOST", "postgres-auth")
DB_NAME = os.getenv("DB_NAME", "authdb")
DB_USER = os.getenv("DB_USER", "authuser")
DB_PASSWORD = os.getenv("DB_PASSWORD", "authpassword")
DB_PORT = int(os.getenv("DB_PORT", 5432))

TOKEN_URL = os.getenv("TOKEN_URL", "https://auth-service:1321/get-tokens")
KEYCLOAK_CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "uu3bjp8FrMRj3wjSBQraUUMlmWzDDInD")
REDIS_HOST = os.getenv("REDIS_ADDR", "redis")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

# Инициализация Redis
redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost", "https://localhost:1319", "https://localhost:1321"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_users():
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        cursor = conn.cursor()
        cursor.execute("SELECT id, login, password_hash, name, created_at FROM users")
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return [{"id": user[0], "login": user[1]} for user in users]
    except Exception as e:
        print(f"Ошибка при подключении к базе данных: {e}")
        return []

def get_tokens(login):
    cache_key = f"tokens:{login}"
    cached_tokens = redis_client.get(cache_key)
    if cached_tokens:
        print(f"Returning cached tokens for {login}")
        return json.loads(cached_tokens)

    try:
        response = requests.get(f"{TOKEN_URL}?login={login}", verify="/app/certs/cert.pem", timeout=5)
        if response.status_code == 200:
            tokens = response.json()
            redis_client.setex(cache_key, 7200, json.dumps(tokens))  # Кэш на 2 часа
            return tokens
        else:
            print(f"Ошибка при запросе токенов для {login}: {response.status_code} - {response.text}")
            return None
    except requests.exceptions.SSLError as e:
        print(f"SSL Error при запросе токенов для {login}: {e}")
        return None
    except Exception as e:
        print(f"Ошибка при запросе токенов для {login}: {e}")
        return None

@app.get("/users")
async def list_users():
    users = get_users()
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return {"users": users}

@app.get("/tokens/{login}")
async def get_user_tokens(login: str):
    print(f"Requested login: {login}")
    users = get_users()
    print(f"Available users: {[u['login'] for u in users]}")
    user = next((u for u in users if u["login"] == login), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    tokens = get_tokens(login)
    if tokens:
        print(f"Returning tokens for {login}: {tokens}")
        return tokens
    raise HTTPException(status_code=500, detail=f"Failed to get tokens for {login}")

@app.post("/tokens")
async def exchange_code_for_tokens(code: str = Form(...), redirect_uri: str = Form(...)):
    print(f"Received request with code: {code}, redirect_uri: {redirect_uri}")
    try:
        token_url = "https://keycloak:8443/realms/auth-service/protocol/openid-connect/token"
        data = {
            "grant_type": "authorization_code",
            "client_id": "auth-service",
            "client_secret": KEYCLOAK_CLIENT_SECRET,
            "code": code,
            "redirect_uri": redirect_uri
        }
        response = requests.post(token_url, data=data, verify="/app/certs/cert.pem", timeout=5)
        if response.status_code == 200:
            tokens = response.json()
            access_token = tokens.get("access_token")
            refresh_token = tokens.get("refresh_token")
            decoded = jwt.decode(access_token, options={"verify_signature": False})
            login_from_token = decoded.get("preferred_username")
            user_id = decoded.get("sub")

            cache_key = f"tokens:{login_from_token}"
            token_data = {
                "AccessToken": access_token,
                "RefreshToken": refresh_token,
                "AccessUUID": f"access_{uuid.uuid4()}",
                "RefreshUUID": f"refresh_{uuid.uuid4()}",
                "AtExpires": tokens.get("expires_in", 300),
                "RtExpires": tokens.get("refresh_expires_in", 1800)
            }
            redis_client.setex(cache_key, 7200, json.dumps(token_data))
            return token_data
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        print(f"Error exchanging code: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8002,
        ssl_certfile="/app/certs/cert.pem",
        ssl_keyfile="/app/certs/key.pem"
    )