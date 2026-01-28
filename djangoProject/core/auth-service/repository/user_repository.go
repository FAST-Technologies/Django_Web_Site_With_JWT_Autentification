package repository

import (
	"database/sql"
	"auth-service/models"
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

func (r *UserRepository) CreateUser(user *models.UserEntity) error {
	query := `INSERT INTO users (login, password_hash, name) VALUES ($1, $2, $3) RETURNING id, created_at`
	return r.DB.QueryRow(query, user.Login, user.PasswordHash, user.Name).
		Scan(&user.ID, &user.CreatedAt)
}

func (r *UserRepository) GetUserByLogin(login string) (*models.UserEntity, error) {
    query := `SELECT id, login, password_hash, name, created_at FROM users WHERE login=$1`
    row := r.DB.QueryRow(query, login)

    var user models.UserEntity
    if err := row.Scan(&user.ID, &user.Login, &user.PasswordHash, &user.Name, &user.CreatedAt); err != nil {
        return nil, err
    }
    return &user, nil
}
