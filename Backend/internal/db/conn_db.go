package db

import (
	"database/sql"
	"fmt"
	"log/slog"
	"os"

	_ "github.com/lib/pq"
)

func ConnectDb() (*sql.DB, error) {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	postgresConnStr := fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName)

	db, err := sql.Open("postgres", postgresConnStr)
	if err != nil {
		slog.Error("Не удалось подключится в PostgreSQL")
		return nil, fmt.Errorf("ошибка подключения к PostgreSQL: %w", err)
	}

	if err := db.Ping(); err != nil {
		db.Close()
		slog.Error("Не удалось подключится в PostgreSQL")
		return nil, fmt.Errorf("не удалось подключиться к PostgreSQL: %w", err)
	}

	slog.Info("Успешное подключение к PostgreSQL!")
	return db, nil
}
