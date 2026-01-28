package models

import "time"

type UserEntity struct {
	ID           int       `json:"id"`
	Login        string    `json:"login"`
	PasswordHash string    `json:"password_hash"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"created_at"`
}
