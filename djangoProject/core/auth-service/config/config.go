package config

import (
	"context"
	"github.com/go-redis/redis/v8"
	"log"
	"os"
	"strconv"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
)

type Config struct {
	RedisAddr     string
	RedisPassword string
	RedisDB       int
	JWTSecret     string
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
}

func LoadConfig() (*Config, error) {
	// Получаем значения из переменных окружения
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		log.Fatal("Переменная REDIS_ADDR не задана")
	}

	redisPassword := os.Getenv("REDIS_PASSWORD")
	// Пароль может быть пустым, поэтому не проверяем его отсутствие

	redisDBStr := os.Getenv("REDIS_DB")
	redisDB, err := strconv.Atoi(redisDBStr)
	if err != nil || redisDBStr == "" {
		log.Fatal("Переменная REDIS_DB не задана или имеет неверный формат")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatal("Переменная JWT_SECRET не задана")
	}

	return &Config{
		RedisAddr:     redisAddr,
		RedisPassword: redisPassword,
		RedisDB:       redisDB,
		JWTSecret:     jwtSecret,
	}, nil
}

func InitRedis(cfg *Config) *redis.Client {
	options := &redis.Options{
		Addr: cfg.RedisAddr,
		DB:   cfg.RedisDB,
	}

	if cfg.RedisPassword != "" {
		options.Password = cfg.RedisPassword
	}

	client := redis.NewClient(options)

	// Проверяем соединение
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		log.Fatalf("Не удалось подключиться к Redis: %v", err)
	}

	return client
}

func (c *Config) LoadPostgresEnv() {
	c.DBHost = os.Getenv("DB_HOST")
	c.DBPort = os.Getenv("DB_PORT")
	c.DBUser = os.Getenv("DB_USER")
	c.DBPassword = os.Getenv("DB_PASSWORD")
	c.DBName = os.Getenv("DB_NAME")

	if c.DBHost == "" || c.DBPort == "" || c.DBUser == "" || c.DBPassword == "" || c.DBName == "" {
		log.Fatal("Одна или несколько переменных окружения для PostgreSQL не заданы")
	}
}

func InitPostgres(cfg *Config) *sql.DB {
	cfg.LoadPostgresEnv()

	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Ошибка при подключении к Postgres: %v", err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatalf("Не удалось подключиться к PostgreSQL: %v", err)
	}

	return db
}
