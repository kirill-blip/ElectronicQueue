package repository

import (
	"backend/internal/apperrors"
	"backend/models"
	"database/sql"
	"log/slog"
	"strconv"
)

type EntryRepository interface {
	AddEntry(models.Entry) (models.Entry, error)
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
	entryRow, err := e.db.Query(`
        SELECT *
        FROM "entry"
        WHERE "id" = $1
    `, id)

	if err != nil {
		return models.Entry{}, err
	}

	entry := models.Entry{}

	for entryRow.Next() {
		var adminId sql.NullInt64

		if err := entryRow.Scan(&entry.Id, &entry.TicketNumber, &entry.UserId, &adminId, &entry.Date, &entry.Status); err != nil {
			slog.Warn(err.Error())
			return models.Entry{}, apperrors.ProblemWithDB
		}

		if adminId.Valid {
			entry.AdminId = int(adminId.Int64)
		} else {
			entry.AdminId = 0
		}
	}

	return entry, nil
}

func (e *EntryRepositoryImpl) AddEntry(entry models.Entry) (models.Entry, error) {
	_, err := e.db.Exec(`
        INSERT INTO "entry" (ticket_number, user_id, date, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id
    `, entry.TicketNumber, entry.UserId, entry.Date, entry.Status)

	if err != nil {
		slog.Info(strconv.Itoa(entry.UserId))
		return models.Entry{}, err
	}

	entryRow, err := e.db.Query(`
        SELECT *
        FROM "entry"
        ORDER BY id DESC
        LIMIT 1
    `)

	if err != nil {
		slog.Warn("Failed to retrieve last inserted ID: " + err.Error())
		return models.Entry{}, err
	}

	for entryRow.Next() {
		var adminId sql.NullInt64

		if err := entryRow.Scan(&entry.Id, &entry.TicketNumber, &entry.UserId, &adminId, &entry.Date, &entry.Status); err != nil {
			slog.Warn(err.Error())
			return models.Entry{}, apperrors.ProblemWithDB
		}

		if adminId.Valid {
			entry.AdminId = int(adminId.Int64)
		} else {
			entry.AdminId = 0
		}
	}

	return entry, nil
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
