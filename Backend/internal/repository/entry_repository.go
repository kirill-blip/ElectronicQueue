package repository

import (
	"backend/internal/apperrors"
	"backend/models"
	"database/sql"
	"log/slog"
)

type EntryRepository interface {
	AddEntry(user models.User) (int, error)
	GenerateEntryRepo(entry models.Entry) error
	GetEntry(int) (models.Entry, error)
	GetLastEntry() (int, error)
	GetUserRepo(adminId int) (models.GetEntry, error)
	GetCountEntry() (int, error)
	ChangeStatusRepo(entryId int, status string) error
	GetDashBoardRepo() ([]models.Table, error)
}

type EntryRepositoryImpl struct {
	db *sql.DB
}

func EntryRepositoryInit(db *sql.DB) EntryRepository {
	return &EntryRepositoryImpl{db: db}
}

func (e *EntryRepositoryImpl) GetEntry(id int) (models.Entry, error) {
	var entry models.Entry
	var adminId sql.NullInt64

	err := e.db.QueryRow(`
        SELECT *
        FROM "entry"
        WHERE user_id = $1
		AND status IN ('WaitForProcessing', 'Processing')
        AND date::date = CURRENT_DATE;
    `, id).Scan(&entry.Id, &entry.TicketNumber, &entry.UserId, &adminId, &entry.Date, &entry.Status)

	if err == sql.ErrNoRows {
		return models.Entry{}, apperrors.UserNotFound
	} else if err != nil {
		return models.Entry{}, err
	}

	if adminId.Valid {
		entry.AdminId = int(adminId.Int64)
	} else {
		entry.AdminId = 0
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
		INSERT INTO entry (ticket_number, user_id, status)
		VALUES ($1, $2, 'WaitForProcessing')
`, user.Ticket, userId)

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

func (e *EntryRepositoryImpl) GenerateEntryRepo(entry models.Entry) error {
	_, err := e.db.Exec(`
		INSERT INTO entry (ticket_number, user_id, status)
		VALUES ($1, $2, 'WaitForProcessing')
`, entry.TicketNumber, entry.UserId)

	return err
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

func (e *EntryRepositoryImpl) GetUserRepo(adminId int) (models.GetEntry, error) {
	tx, err := e.db.Begin()
	if err != nil {
		return models.GetEntry{}, err
	}

	var entryId int
	var userId int

	err = tx.QueryRow(`
		SELECT id, user_id 
		FROM entry 
		WHERE status = 'WaitForProcessing'
		AND date::date = CURRENT_DATE;
	`).Scan(&entryId, &userId)

	if err == sql.ErrNoRows {
		tx.Rollback()
		return models.GetEntry{}, apperrors.NoUser
	} else if err != nil {
		tx.Rollback()
		return models.GetEntry{}, err
	}

	_, err = tx.Exec(`
    UPDATE entry
    SET status = $1, admin_id = $2
    WHERE id = $3
`, "Processing", adminId, entryId)

	if err != nil {
		tx.Rollback()
		return models.GetEntry{}, err
	}

	var entry models.GetEntry

	err = tx.QueryRow(`
		SELECT e.id, u.id, u.first_name, u.last_name, u.number_phone 
		FROM "entry" e
		JOIN "user" u 
		    ON e.user_id = u.id
		WHERE e.id = $1
`, entryId).Scan(&entry.EntryId, &entry.UserId, &entry.FirstName, &entry.LastName, &entry.NumberPhone)

	if err != nil {
		tx.Rollback()
		return models.GetEntry{}, err
	}

	err = tx.Commit()
	if err != nil {
		return models.GetEntry{}, err
	}

	return entry, nil
}

func (e *EntryRepositoryImpl) GetCountEntry() (int, error) {
	var count int

	err := e.db.QueryRow(`
		SELECT COUNT(*) 
		FROM entry
		WHERE status = 'WaitForProcessing'
		AND date::date = CURRENT_DATE;
`).Scan(&count)

	if err != nil {
		return 0, err
	}

	return count, nil
}

func (e *EntryRepositoryImpl) ChangeStatusRepo(entryId int, status string) error {
	_, err := e.db.Exec(`
		UPDATE entry
		SET status = $1
		WHERE id = $2
	`, status, entryId)

	return err
}

func (e *EntryRepositoryImpl) GetDashBoardRepo() ([]models.Table, error) {
	var tables []models.Table

	rows, err := e.db.Query(`
		SELECT a.table_number, e.ticket_number
		FROM "entry" e
		JOIN "admin" a 
		    ON e.admin_id = a.id
		WHERE e.status = 'Processing'
		ORDER BY a.table_number;
`)

	if err != nil {
		return tables, err
	}
	defer rows.Close()

	for rows.Next() {
		var table models.Table

		if err := rows.Scan(&table.TableNumber, &table.TicketNumber); err != nil {
			return tables, err
		}

		tables = append(tables, table)
	}

	return tables, nil
}
