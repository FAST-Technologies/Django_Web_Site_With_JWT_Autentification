package utils

import (
	"auth-service/models"
	"context"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"golang.org/x/crypto/bcrypt"

	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/lestrrat-go/jwx/jwk"
	"log"
	"time"
)

func GenerateUUID() string {
	return uuid.New().String()
}

func GenerateTokens(userID int, jwtSecret string) (*models.TokenDetails, error) {
	td := &models.TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 15)   // 15 минут
	td.RtExpires = time.Now().Add(time.Hour * 24 * 7) // 7 дней

	td.AccessUUID = "access_" + uuid.NewString()
	td.RefreshUUID = "refresh_" + uuid.NewString()

	accessClaims := jwt.MapClaims{
		"user_id":     userID,
		"access_uuid": td.AccessUUID,
		"exp":         td.AtExpires.Unix(),
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenStr, err := accessToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return nil, err
	}
	td.AccessToken = accessTokenStr

	refreshClaims := jwt.MapClaims{
		"user_id":      userID,
		"refresh_uuid": td.RefreshUUID,
		"exp":          td.RtExpires.Unix(),
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenStr, err := refreshToken.SignedString([]byte(jwtSecret))
	if err != nil {
		return nil, err
	}
	td.RefreshToken = refreshTokenStr

	return td, nil
}

func RefreshToken(refreshToken string, redisClient *redis.Client, jwtSecret string) (*models.TokenDetails, error) {
	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); ok {
			return []byte(jwtSecret), nil
		}
		if _, ok := token.Method.(*jwt.SigningMethodRSA); ok {
			jwksURL := "https://keycloak:8180/realms/auth-service/protocol/openid-connect/certs"
			client := &http.Client{
				Transport: &http.Transport{
					TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
				},
			}
			resp, err := client.Get(jwksURL)
			if err != nil {
				return nil, fmt.Errorf("failed to fetch JWKS: %v", err)
			}
			defer resp.Body.Close()

			var rawKeys json.RawMessage
			if err := json.NewDecoder(resp.Body).Decode(&rawKeys); err != nil {
				return nil, fmt.Errorf("failed to decode JWKS: %v", err)
			}

			set, err := jwk.Parse(rawKeys)
			if err != nil {
				return nil, fmt.Errorf("failed to parse JWKS: %v", err)
			}

			kid, ok := token.Header["kid"].(string)
			if !ok {
				return nil, fmt.Errorf("kid not found in token header")
			}

			iter := set.Iterate(context.Background())
			for iter.Next(context.Background()) {
				pair := iter.Pair()
				key := pair.Value.(jwk.Key)
				if keyID := key.KeyID(); keyID == kid {
					var rawKey interface{}
					if err := key.Raw(&rawKey); err != nil {
						return nil, fmt.Errorf("failed to get raw key: %v", err)
					}
					return rawKey, nil
				}
			}
			return nil, fmt.Errorf("no matching key found in JWKS for kid: %s", kid)
		}
		return nil, jwt.ErrSignatureInvalid
	})

	if err != nil || !token.Valid {
		return nil, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, jwt.ErrInvalidKey
	}

	refreshUUID, _ := claims["refresh_uuid"].(string)
	if refreshUUID == "" {
		refreshUUID = claims["jti"].(string) // Используем jti для Keycloak
	}
	userIDFloat, _ := claims["user_id"].(float64)
	userIDStr, _ := claims["sub"].(string)
	var userID int
	if userIDFloat != 0 {
		userID = int(userIDFloat)
	} else if userIDStr != "" {
		userID, _ = strconv.Atoi(strings.Split(userIDStr, "-")[0]) // Простая обработка sub
	} else {
		return nil, fmt.Errorf("user_id or sub not found in claims")
	}

	ctx := context.Background()
	_, err = redisClient.Get(ctx, refreshUUID).Result()
	if err == redis.Nil {
		return nil, fmt.Errorf("refresh token not found in Redis")
	}

	newTokens, err := GenerateTokens(userID, jwtSecret)
	if err != nil {
		return nil, err
	}

	redisClient.Del(ctx, refreshUUID)
	return newTokens, nil
}

func HashPassword(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Ошибка хэширования пароля: %v", err)
	}
	return string(hash)
}