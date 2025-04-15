package repository

import (
	"backend/internal/apperrors"
	"backend/models"
	"database/sql"
	"log/slog"
)

type AdminRepository interface {
	AddAdmin(admin models.Admin) error
	GetAdmins() ([]models.Admin, error)
}

type AdminRepositoryImpl struct {
	db *sql.DB
}

func AdminRepositoryInit(db *sql.DB) AdminRepository {
	return &AdminRepositoryImpl{db: db}
}
func (r *AdminRepositoryImpl) AddAdmin(admin models.Admin) error {
	_ = r.db.QueryRow(`
    INSERT INTO "admin" (login, first_name, last_name, password, table_number)
    VALUES ($1, $2, $3, $4, $5)`, admin.Login, admin.FirstName, admin.LastName, admin.Password, admin.TableNumber)

	return nil
}

func (r *AdminRepositoryImpl) GetAdmins() ([]models.Admin, error) {
	var admins []models.Admin

	rows, err := r.db.Query(`
    SELECT first_name, last_name, password, table_number
    FROM "admin"`)

	if err != nil {
		slog.Warn(err.Error())
		return nil, apperrors.ProblemWithDB
	}

	for rows.Next() {
		var admin models.Admin

		if err := rows.Scan(&admin.FirstName, &admin.LastName, &admin.Password, &admin.TableNumber); err != nil {
			slog.Warn(err.Error())
			return nil, apperrors.ProblemWithDB
		}

		admins = append(admins, admin)
	}

	return admins, nil
}
