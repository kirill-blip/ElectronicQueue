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
	userRepo := repository.UserRepositoryInit(db)

	adminService := service.AdminServiceInit(adminRepo)
	userService := service.UserServiceImplInit(userRepo)

	adminHandler := NewAdminHandler(adminService)
	userHandler := NewUserHandler(userService)

	mux.HandleFunc("POST /api/admin-registration", adminHandler.RegisterAdmin)
	mux.HandleFunc("GET /api/admin", adminHandler.GetAdmins)
	mux.HandleFunc("POST /api/admin/login", adminHandler.LogInAdmin)
	mux.HandleFunc("POST /api/admin/logout", adminHandler.LogOutAdmin)
	mux.HandleFunc("POST /api/refresh", adminHandler.Refresh)
	mux.HandleFunc("GET /api/admin/get", middleware.AdminAuthMiddleware(adminHandler.GetAdminDesktop))

	mux.HandleFunc("POST /api/user/add", userHandler.AddUser)
	mux.HandleFunc("GET /api/user/get", userHandler.GetUser)
	//mux.HandleFunc("GET /api/")

	return mux, nil
}
