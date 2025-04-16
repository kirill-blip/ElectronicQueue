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
	GetAdmin(login string) (models.Admin, error)
	GetAdminForPanel(id int) (models.AdminPanel, error)
}

type AdminRepositoryImpl struct {
	db *sql.DB
}

func AdminRepositoryInit(db *sql.DB) AdminRepository {
	return &AdminRepositoryImpl{db: db}
}

func (r *AdminRepositoryImpl) AddAdmin(admin models.Admin) error {
	_, err := r.db.Exec(`
    INSERT INTO "admin" (login, first_name, last_name, password, table_number)
    VALUES ($1, $2, $3, $4, $5)`, admin.Login, admin.FirstName, admin.LastName, admin.Password, admin.TableNumber)

	if err != nil {
		return err
	}

	return nil
}

func (r *AdminRepositoryImpl) GetAdmins() ([]models.Admin, error) {
	var admins []models.Admin

	rows, err := r.db.Query(`
    SELECT login, password, table_number
    FROM "admin"`)

	if err != nil {
		slog.Warn(err.Error())
		return nil, apperrors.ProblemWithDB
	}

	for rows.Next() {
		var admin models.Admin

		if err := rows.Scan(&admin.Login, &admin.Password, &admin.TableNumber); err != nil {
			slog.Warn(err.Error())
			return nil, apperrors.ProblemWithDB
		}

		admins = append(admins, admin)
	}

	return admins, nil
}

func (r *AdminRepositoryImpl) GetAdmin(login string) (models.Admin, error) {
	var admin models.Admin

	query := `SELECT id, login, password FROM "admin" WHERE login = $1`
	err := r.db.QueryRow(query, login).Scan(&admin.ID, &admin.Login, &admin.Password)

	if err == sql.ErrNoRows {
		return models.Admin{}, apperrors.LogInWrongLogin
	} else if err != nil {
		return models.Admin{}, err
	}

	return admin, nil
}

func (r *AdminRepositoryImpl) GetAdminForPanel(id int) (models.AdminPanel, error) {
	var admin models.AdminPanel

	query := `SELECT first_name, last_name, table_number  FROM "admin" WHERE id = $1 LIMIT 1`

	err := r.db.QueryRow(query, id).Scan(&admin.FirstName, &admin.LastName, &admin.Table)

	if err == sql.ErrNoRows {
		return models.AdminPanel{}, apperrors.ProblemWithDB
	} else if err != nil {
		return models.AdminPanel{}, err
	}

	return admin, nil
}

//func (r *AdminRepositoryImpl) GetAdminForPanel(id int) (models.AdminPanel, error) {
//
//}
