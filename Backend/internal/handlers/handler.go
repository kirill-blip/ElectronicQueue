package handlers

import (
	"backend/internal/middleware"
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
	mux.HandleFunc("POST /api/admin/login", adminHandler.LogInAdmin)
	mux.HandleFunc("POST /api/refresh", adminHandler.Refresh)
	mux.HandleFunc("GET /api/admin/get", middleware.TokenAuthMiddleware(adminHandler.GetAdminDesktop))
	//mux.HandleFunc("GET /api/")

	return mux, nil
}
