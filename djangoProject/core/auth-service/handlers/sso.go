package handlers

import (
    "auth-service/models"
    "auth-service/repository"
    "auth-service/utils"
    "context"
    "crypto/tls"
    "database/sql"
    "encoding/json"
    "fmt"
    "github.com/coreos/go-oidc/v3/oidc"
    "github.com/go-redis/redis/v8"
    "golang.org/x/oauth2"
    "net/http"
    "os"
    "log"
    "strings"
    "time"
)

type SSOHandler struct {
    oauth2Config *oauth2.Config
    verifier     *oidc.IDTokenVerifier
    userRepo     *repository.UserRepository
    redisClient  *redis.Client
    jwtSecret    string
}

func NewSSOHandler(db *sql.DB, redisClient *redis.Client, jwtSecret string) (*SSOHandler, error) {
    var provider *oidc.Provider
    var err error

    keycloakURL := "https://keycloak:8443"
    for i := 0; i < 20; i++ {
        ctx := context.Background()
        client := &http.Client{
            Transport: &http.Transport{
                TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
            },
        }
        ctx = context.WithValue(ctx, oauth2.HTTPClient, client)
        provider, err = oidc.NewProvider(ctx, keycloakURL+"/realms/auth-service")
        if err == nil {
            break
        }
        fmt.Printf("Попытка %d: не удалось инициализировать OIDC-провайдер: %v\n", i+1, err)
        time.Sleep(10 * time.Second)
    }

    if err != nil {
        return nil, fmt.Errorf("failed to initialize OIDC provider after retries: %v", err)
    }

    oauth2Config := &oauth2.Config{
        ClientID:     "auth-service",
        ClientSecret: os.Getenv("KEYCLOAK_CLIENT_SECRET"),
        RedirectURL:  "https://localhost:1321/callback",
        Endpoint:     provider.Endpoint(),
        Scopes:       []string{oidc.ScopeOpenID, "profile", "email"},
    }

    verifier := provider.Verifier(&oidc.Config{
        ClientID:        "auth-service",
        SkipIssuerCheck: true,
    })

    return &SSOHandler{
        oauth2Config: oauth2Config,
        verifier:     verifier,
        userRepo:     repository.NewUserRepository(db),
        redisClient:  redisClient,
        jwtSecret:    jwtSecret,
    }, nil
}

func (h *SSOHandler) LoginSSO(w http.ResponseWriter, r *http.Request) {
    state := r.URL.Query().Get("state")
    if state == "" {
        state = "login_" + utils.GenerateUUID()
        log.Printf("Generated state for LoginSSO: %s", state)
    }
    ctx := context.Background()
    err := h.redisClient.Set(ctx, "sso_state:"+state, "login", 10*time.Minute).Err()
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось сохранить state: %v", err), http.StatusInternalServerError)
        return
    }

    url := h.oauth2Config.AuthCodeURL(state)
    url = strings.Replace(url, "https://keycloak:8443", "https://localhost:8443", 1)
    log.Printf("Redirecting to: %s", url)
    http.Redirect(w, r, url, http.StatusFound)
}

func (h *SSOHandler) RegisterSSO(w http.ResponseWriter, r *http.Request) {
    state := r.URL.Query().Get("state")
    if state == "" {
        state = "register_" + utils.GenerateUUID()
        log.Printf("Generated state for RegisterSSO: %s", state)
    }
    ctx := context.Background()
    err := h.redisClient.Set(ctx, "sso_state:"+state, "register", 10*time.Minute).Err()
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось сохранить state: %v", err), http.StatusInternalServerError)
        return
    }

    url := h.oauth2Config.AuthCodeURL(state)
    url = strings.Replace(url, "https://keycloak:8443", "https://localhost:8443", 1)
    log.Printf("Redirecting to: %s", url)
    http.Redirect(w, r, url, http.StatusFound)
}

func (h *SSOHandler) Callback(w http.ResponseWriter, r *http.Request) {
    ctx := context.Background()
    state := r.URL.Query().Get("state")
    if state == "" {
        http.Error(w, "State не указан", http.StatusBadRequest)
        return
    }

    action, err := h.redisClient.Get(ctx, "sso_state:"+state).Result()
    if err == redis.Nil {
        http.Error(w, "State не найден или истёк", http.StatusBadRequest)
        return
    }
    log.Printf("Проверка state в Redis дала результат: %v", action)
    if err != nil {
        http.Error(w, fmt.Sprintf("Ошибка при проверке state: %v", err), http.StatusInternalServerError)
        return
    }
    h.redisClient.Del(ctx, "sso_state:"+state)

    code := r.URL.Query().Get("code")
    if code == "" {
        http.Error(w, "Код отсутствует", http.StatusBadRequest)
        return
    }

    client := &http.Client{
        Transport: &http.Transport{
            TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
        },
    }
    ctx = context.WithValue(ctx, oauth2.HTTPClient, client)

    token, err := h.oauth2Config.Exchange(ctx, code)
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось обменять код на токен: %v", err), http.StatusInternalServerError)
        return
    }

    rawIDToken, ok := token.Extra("id_token").(string)
    if !ok {
        http.Error(w, "ID-токен отсутствует", http.StatusInternalServerError)
        return
    }

    idToken, err := h.verifier.Verify(ctx, rawIDToken)
    if err != nil {
        http.Error(w, fmt.Sprintf("Неверный ID-токен: %v", err), http.StatusInternalServerError)
        return
    }

    var claims struct {
        Sub               string `json:"sub"`
        Email             string `json:"email"`
        Name              string `json:"name"`
        PreferredUsername string `json:"preferred_username"`
        Jti               string `json:"jti"`
    }
    if err := idToken.Claims(&claims); err != nil {
        http.Error(w, fmt.Sprintf("Не удалось извлечь claims: %v", err), http.StatusInternalServerError)
        return
    }

    login := claims.PreferredUsername
    if login == "" {
        login = claims.Sub
    }

    user, err := h.userRepo.GetUserByLogin(login)
    if err != nil {
        user = &models.UserEntity{
            Login:        login,
            PasswordHash: utils.HashPassword("1234"),
            Name:         claims.Name,
            CreatedAt:    time.Now(),
        }
        if err := h.userRepo.CreateUser(user); err != nil {
            http.Error(w, fmt.Sprintf("Не удалось создать пользователя: %v", err), http.StatusInternalServerError)
            return
        }
    }

    tokens, err := utils.GenerateTokens(user.ID, h.jwtSecret)
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось сгенерировать токены: %v", err), http.StatusInternalServerError)
        return
    }

    err = h.redisClient.Set(ctx, tokens.AccessUUID, user.ID, time.Until(tokens.AtExpires)).Err()
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось сохранить access токен: %v", err), http.StatusInternalServerError)
        return
    }
    err = h.redisClient.Set(ctx, tokens.RefreshUUID, user.ID, time.Until(tokens.RtExpires)).Err()
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось сохранить refresh токен: %v", err), http.StatusInternalServerError)
        return
    }

    tokenData := struct {
        AccessToken  string    `json:"AccessToken"`
        RefreshToken string    `json:"RefreshToken"`
        AccessUUID   string    `json:"AccessUUID"`
        RefreshUUID  string    `json:"RefreshUUID"`
        AtExpires    time.Time `json:"AtExpires"`
        RtExpires    time.Time `json:"RtExpires"`
    }{
        AccessToken:  tokens.AccessToken,
        RefreshToken: tokens.RefreshToken,
        AccessUUID:   tokens.AccessUUID,
        RefreshUUID:  tokens.RefreshUUID,
        AtExpires:    tokens.AtExpires,
        RtExpires:    tokens.RtExpires,
    }

    tokenDataJSON, err := json.Marshal(tokenData)
    if err != nil {
        http.Error(w, fmt.Sprintf("Не удалось сериализовать токены: %v", err), http.StatusInternalServerError)
        return
    }

    redirectURL := fmt.Sprintf("https://localhost/callback?state=%s&tokens=%s",
        state, string(tokenDataJSON))
    http.Redirect(w, r, redirectURL, http.StatusFound)
}