package repository

import (
	"backend/internal/apperrors"
	"backend/models"
	"database/sql"
	"log/slog"
)

type EntryRepository interface {
	AddEntry(user models.User) (int, error)
	GetEntry(int) (models.Entry, error)
	GetLastEntry() (int, error)
}

type EntryRepositoryImpl struct {
	db *sql.DB
}

func EntryRepositoryInit(db *sql.DB) EntryRepository {
	return &EntryRepositoryImpl{db: db}
}

func (e *EntryRepositoryImpl) GetEntry(id int) (models.Entry, error) {
	var entry models.Entry

	err := e.db.QueryRow(`
        SELECT *
        FROM "entry"
        WHERE user_id = $1
    `, id).Scan(&entry.Id, &entry.TicketNumber, &entry.UserId, &entry.AdminId, &entry.Date, &entry.Status)

	if err == sql.ErrNoRows {
		return models.Entry{}, apperrors.UserNotFound
	} else if err != nil {
		return models.Entry{}, err
	}

	return entry, nil
}

func (e *EntryRepositoryImpl) AddEntry(user models.User) (int, error) {
	tx, err := e.db.Begin()
	if err != nil {
		return 0, err
	}

	var userId int

	err = tx.QueryRow(`
		INSERT INTO "user" (first_name, last_name, number_phone) 
		VALUES ($1, $2, $3) RETURNING id
`, user.FirstName, user.LastName, user.NumberPhone).Scan(&userId)

	if err != nil {
		tx.Rollback()
		return 0, err
	}

	_, err = tx.Exec(`
		INSERT INTO entry (user_id, status)
		VALUES ($1, models.EntryStatus.Waiting)
`, userId)

	if err != nil {
		tx.Rollback()
		return 0, err
	}

	err = tx.Commit()
	if err != nil {
		return 0, err
	}
	return userId, nil
}

func (e *EntryRepositoryImpl) GetLastEntry() (int, error) {
	query := `
        SELECT id, ticket_number, user_id, admin_id, date, status
        FROM entry
        WHERE "date"::DATE = CURRENT_DATE
        ORDER BY ticket_number DESC
        LIMIT 1;
    `

	entryRow, err := e.db.Query(query)
	if err != nil {
		slog.Warn("Failed to execute query: " + err.Error())
		return 0, apperrors.ProblemWithDB
	}
	defer entryRow.Close()

	var entry models.Entry
	if entryRow.Next() {
		var adminId sql.NullInt64

		if err := entryRow.Scan(&entry.Id, &entry.TicketNumber, &entry.UserId, &adminId, &entry.Date, &entry.Status); err != nil {
			slog.Warn("Failed to scan row: " + err.Error())
			return 0, apperrors.ProblemWithDB
		}

		if adminId.Valid {
			entry.AdminId = int(adminId.Int64)
		} else {
			entry.AdminId = 0
		}
	} else {
		slog.Info("No entries found for the current date")
		return 0, nil
	}

	return entry.TicketNumber, nil
}
