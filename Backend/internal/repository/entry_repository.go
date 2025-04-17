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
	GetLastEntry() (models.Entry, error)
}

type EntryRepositoryImpl struct {
	db *sql.DB
}

func EntryRepositoryInit(db *sql.DB) EntryRepository {
	return &EntryRepositoryImpl{db: db}
}

func (e *EntryRepositoryImpl) GetEntry(int) (models.Entry, error) {
	entryRow, err := e.db.Query(`
        SELECT *
        FROM "entry"
        ORDER BY id DESC
        LIMIT 1
    `)

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

func (e *EntryRepositoryImpl) GetLastEntry() (models.Entry, error) {
	entryRow, err := e.db.Query(`
		SELECT *
		FROM "entry"
		LIMIT 1
	`)

	if err != nil {
		return models.Entry{}, err
	}

	var entry models.Entry

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
