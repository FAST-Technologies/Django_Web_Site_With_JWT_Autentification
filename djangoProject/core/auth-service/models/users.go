package models

import "time"

// User представляет пользователя в системе
type User struct {
	ID       int    `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

// TokenDetails представляет детали JWT-токена
type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUUID   string
	RefreshUUID  string
	AtExpires    time.Time
	RtExpires    time.Time
}
