package handlers

import (
	"backend/internal/repository"
	"backend/internal/service"
	"database/sql"
	"net/http"
)

func InitHandler(db *sql.DB) (*http.ServeMux, error) {
	mux := http.NewServeMux()

	adminRepo := repository.AdminRepositoryInit(db)
	adminService := service.AdminServiceInit(adminRepo)
	adminHandler := NewAdminHandler(adminService)

	mux.HandleFunc("POST /api/admin-registration", adminHandler.RegisterAdmin)
	mux.HandleFunc("GET /api/admin", adminHandler.GetAdmins)

	return mux, nil
}
