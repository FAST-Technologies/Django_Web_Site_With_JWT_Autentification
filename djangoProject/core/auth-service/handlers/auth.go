package handlers

import (
	"auth-service/models"
	"auth-service/repository"
	"auth-service/utils"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis/v8"
	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

type AuthHandler struct {
	redisClient *redis.Client
	userRepo    *repository.UserRepository
	jwtSecret   string
	ssoHandler  *SSOHandler
}

func RegisterAuthHandlers(router *mux.Router, redisClient *redis.Client, db *sql.DB, jwtSecret string) {
	ssoHandler, err := NewSSOHandler(db, redisClient, jwtSecret)
	if err != nil {
		fmt.Printf("Ошибка инициализации SSO: %v\n", err)
	}

	handler := &AuthHandler{
		redisClient: redisClient,
		userRepo:    repository.NewUserRepository(db),
		jwtSecret:   jwtSecret,
		ssoHandler:  ssoHandler,
	}

	router.HandleFunc("/", HomeHandler).Methods("GET")
	router.HandleFunc("/login", handler.Login).Methods("POST")
	router.HandleFunc("/logout", handler.Logout).Methods("POST")
	router.HandleFunc("/refresh", handler.Refresh).Methods("POST", "OPTIONS")
	router.HandleFunc("/get-tokens", handler.GetTokens).Methods("GET") // Восстановили маршрут

	if ssoHandler != nil {
		router.HandleFunc("/sso/login", handler.ssoHandler.LoginSSO).Methods("GET")
		router.HandleFunc("/callback", handler.ssoHandler.Callback).Methods("GET")
	} else {
		fmt.Println("SSO-маршруты не зарегистрированы из-за ошибки инициализации")
	}
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Добро пожаловать в сервис аутентификации!")
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Неверный запрос", http.StatusBadRequest)
		return
	}

	dbUser, err := h.userRepo.GetUserByLogin(user.Login)
	if err != nil {
		http.Error(w, "Пользователь не найден", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.PasswordHash), []byte(user.Password)); err != nil {
		http.Error(w, "Неверный пароль", http.StatusUnauthorized)
		return
	}

	tokens, err := utils.GenerateTokens(dbUser.ID, h.jwtSecret)
	if err != nil {
		http.Error(w, "Не удалось сгенерировать токены", http.StatusInternalServerError)
		return
	}

	ctx := context.Background()
	err = h.redisClient.Set(ctx, tokens.AccessUUID, dbUser.ID, time.Until(tokens.AtExpires)).Err()
	if err != nil {
		http.Error(w, "Не удалось сохранить access токен", http.StatusInternalServerError)
		return
	}
	err = h.redisClient.Set(ctx, tokens.RefreshUUID, dbUser.ID, time.Until(tokens.RtExpires)).Err()
	if err != nil {
		http.Error(w, "Не удалось сохранить refresh токен", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tokens)
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	log.Printf("Received /refresh request: %s %s, Headers: %v", r.Method, r.URL.Path, r.Header)
	var tokenReq struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&tokenReq); err != nil {
		log.Printf("Ошибка декодирования JSON в /refresh: %v", err)
		http.Error(w, "Неверный запрос", http.StatusBadRequest)
		return
	}
	newTokens, err := utils.RefreshToken(tokenReq.RefreshToken, h.redisClient, h.jwtSecret)
	if err != nil {
		log.Printf("Ошибка обновления токена: %v", err)
		http.Error(w, "Неверный или истёкший refresh токен", http.StatusUnauthorized)
		return
	}
	log.Printf("Токены успешно обновлены: AccessUUID=%s, RefreshUUID=%s", newTokens.AccessUUID, newTokens.RefreshUUID)
	json.NewEncoder(w).Encode(newTokens)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var tokenReq struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(r.Body).Decode(&tokenReq); err != nil {
		http.Error(w, "Неверный запрос", http.StatusBadRequest)
		return
	}

	token, err := jwt.Parse(tokenReq.AccessToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(h.jwtSecret), nil
	})
	if err != nil {
		http.Error(w, "Неверный токен: "+err.Error(), http.StatusUnauthorized)
		return
	}
	if !token.Valid {
		http.Error(w, "Токен истёк или недействителен", http.StatusUnauthorized)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		http.Error(w, "Неверные claims токена", http.StatusUnauthorized)
		return
	}

	accessUUID, ok := claims["access_uuid"].(string)
	if !ok {
		http.Error(w, "Отсутствует access_uuid в токене", http.StatusUnauthorized)
		return
	}

	ctx := context.Background()
	err = h.redisClient.Del(ctx, accessUUID).Err()
	if err != nil {
		http.Error(w, "Ошибка удаления токена: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *AuthHandler) GetTokens(w http.ResponseWriter, r *http.Request) {
	login := r.URL.Query().Get("login")
	if login == "" {
		http.Error(w, "Login не указан", http.StatusBadRequest)
		return
	}

	user, err := h.userRepo.GetUserByLogin(login)
	if err != nil {
		http.Error(w, "Пользователь не найден", http.StatusUnauthorized)
		return
	}

	tokens, err := utils.GenerateTokens(user.ID, h.jwtSecret)
	if err != nil {
		http.Error(w, "Не удалось сгенерировать токены", http.StatusInternalServerError)
		return
	}

	ctx := context.Background()
	err = h.redisClient.Set(ctx, tokens.AccessUUID, user.ID, time.Until(tokens.AtExpires)).Err()
	if err != nil {
		http.Error(w, "Не удалось сохранить access токен", http.StatusInternalServerError)
		return
	}
	err = h.redisClient.Set(ctx, tokens.RefreshUUID, user.ID, time.Until(tokens.RtExpires)).Err()
	if err != nil {
		http.Error(w, "Не удалось сохранить refresh токен", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tokens)
}