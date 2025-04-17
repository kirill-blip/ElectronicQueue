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
}

type UserRepositoryImpl struct {
	db *sql.DB
}

func UserRepositoryInit(db *sql.DB) UserRepository {
	return &UserRepositoryImpl{db: db}
}

func (u *UserRepositoryImpl) AddUser(user models.User) error {
	_, err := u.db.Exec(`
		INSERT INTO "user" (first_name, last_name, number_phone)
		VALUES ($1, $2, $3)
	`, user.FirstName, user.LastName, user.NumberPhone)

	if err != nil {
		return err
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
	return user, nil
}
