package main

import (
	"auth-service/config"
	"auth-service/handlers"
	"auth-service/middleware"
	"fmt"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Не удалось загрузить конфигурацию: %v", err)
	}

	redisClient := config.InitRedis(cfg)
	db := config.InitPostgres(cfg)
	defer db.Close()

	// Основной маршрутизатор для HTTPS-сервера (порт 1321)
	router := mux.NewRouter()

	// Инициализация SSOHandler
	ssoHandler, err := handlers.NewSSOHandler(db, redisClient, cfg.JWTSecret)
	if err != nil {
		log.Printf("Ошибка инициализации SSO: %v, продолжаем без SSO", err)
	} else {
		// Регистрация маршрутов для SSO
		router.HandleFunc("/sso/login", ssoHandler.LoginSSO).Methods("GET")
		router.HandleFunc("/sso/register", ssoHandler.RegisterSSO).Methods("GET")
		router.HandleFunc("/callback", ssoHandler.Callback).Methods("GET")
	}

	// Регистрация остальных обработчиков
	handlers.RegisterAuthHandlers(router, redisClient, db, cfg.JWTSecret)

	// Защищённый маршрут
	router.Handle("/protected", middleware.JWTAuth(redisClient, cfg.JWTSecret)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Это защищённая страница!")
	}))).Methods("GET")

	// Применяем CORS middleware к основному маршрутизатору
	corsRouter := middleware.CORSMiddleware(router)

	// Запуск HTTPS-сервера на порту 1321
	log.Printf("Запускаем HTTPS сервер на :1321")
	log.Fatal(http.ListenAndServeTLS(":1321", "/app/certs/cert.pem", "/app/certs/key.pem", corsRouter))
}