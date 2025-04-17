package repository

import (
	"backend/internal/apperrors"
	"backend/models"
	"database/sql"
	"log/slog"
)

type UserRepository interface {
	AddUser(user models.User) error
	GetUser(id int) (models.User, error)
	GetUserIdByPhone(phone string) int
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func UserRepositoryInit(db *sql.DB) UserRepository {
	return &UserRepositoryImpl{db: db}
}

func (u *UserRepositoryImpl) AddUser(user models.User) error {
	var exists bool
	err := u.db.QueryRow(`
        SELECT EXISTS (
            SELECT 1
            FROM "user"
            WHERE number_phone = $1
        )
    `, user.NumberPhone).Scan(&exists)

	if !exists {
		_, err = u.db.Exec(`
			INSERT INTO "user" (first_name, last_name, number_phone)
			VALUES ($1, $2, $3)
		`, user.FirstName, user.LastName, user.NumberPhone)
	}

	if err != nil {
		return err
	}

	if exists {
		slog.Error("Have user")
		return apperrors.ContainesData
	}

	return nil
}

func (u *UserRepositoryImpl) GetUser(id int) (models.User, error) {
	userRow, err := u.db.Query(`
		SELECT first_name, last_name, number_phone
		FROM "user"
		WHERE "user".id = $1
	`, id)

	if err != nil {
		return models.User{}, err
	}

	var user models.User

	for userRow.Next() {
		if err := userRow.Scan(&user.FirstName, &user.LastName, &user.NumberPhone); err != nil {
			slog.Warn(err.Error())
			return models.User{}, apperrors.ProblemWithDB
		}
	}

	if user.FirstName == "" {
		return models.User{}, apperrors.InvalidUserID
	}

	return user, nil
}

func (u *UserRepositoryImpl) GetUserIdByPhone(phone string) int {
	var id int

	u.db.QueryRow(`
		SELECT id
		FROM "user"
		WHERE number_phone = $1
	`, phone).Scan(&id)

	return id
}
