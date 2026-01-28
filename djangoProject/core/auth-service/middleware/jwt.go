package middleware

import (
	"context"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v5"
	"log"
	"net/http"
	"strings"
)

func JWTAuth(redisClient *redis.Client, jwtSecret string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, "Токен не предоставлен", http.StatusUnauthorized)
				return
			}

			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenStr == authHeader {
				http.Error(w, "Неверный формат токена", http.StatusUnauthorized)
				return
			}

			token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, jwt.ErrSignatureInvalid
				}
				return []byte(jwtSecret), nil
			})
			if err != nil || !token.Valid {
				http.Error(w, "Неверный токен", http.StatusUnauthorized)
				return
			}

			claims, ok := token.Claims.(jwt.MapClaims)
			if !ok {
				http.Error(w, "Неверные claims токена", http.StatusUnauthorized)
				return
			}

			accessUUID, _ := claims["access_uuid"].(string)
			ctx := context.Background()
			_, err = redisClient.Get(ctx, accessUUID).Result()
			if err == redis.Nil {
				http.Error(w, "Токен отозван", http.StatusUnauthorized)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("CORS Middleware: Handling request %s %s", r.Method, r.URL.Path)
        w.Header().Set("Access-Control-Allow-Origin", "https://localhost:1319,https://localhost:1321") // Временно для тестов, позже уточните порты
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Allow-Credentials", "true")
        if r.Method == "OPTIONS" {
            log.Printf("CORS Middleware: Handling OPTIONS request for %s", r.URL.Path)
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}