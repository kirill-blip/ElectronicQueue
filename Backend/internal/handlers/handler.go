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
	entryRepo := repository.EntryRepositoryInit(db)

	adminService := service.AdminServiceInit(adminRepo)
	userService := service.UserServiceImplInit(userRepo)
	entryService := service.EntryServiceImplInit(entryRepo, userRepo, adminRepo)

	adminHandler := NewAdminHandler(adminService)
	userHandler := NewUserHandler(userService)
	entryHandler := NewEntryHandler(entryService)

	mux.HandleFunc("POST /api/admin-registration", adminHandler.RegisterAdmin)
	mux.HandleFunc("GET /api/admin", adminHandler.GetAdmins)
	mux.HandleFunc("POST /api/admin/login", adminHandler.LogInAdmin)
	mux.HandleFunc("POST /api/admin/logout", adminHandler.LogOutAdmin)
	mux.HandleFunc("POST /api/refresh", adminHandler.Refresh)
	mux.HandleFunc("GET /api/admin/get", middleware.AdminAuthMiddleware(adminHandler.GetAdminDesktop))
	mux.HandleFunc("POST /api/entry/get-admin", adminHandler.GetAdmin)

	mux.HandleFunc("POST /api/user/add", userHandler.AddUser)
	mux.HandleFunc("GET /api/user/get", middleware.UserMiddleware(userHandler.GetUser))
	mux.HandleFunc("PUT /api/user/update", middleware.UserMiddleware(userHandler.UpdateUser)) // +

	mux.HandleFunc("POST /api/entry/generate", middleware.UserMiddleware(entryHandler.GenerateEntry))

	mux.HandleFunc("POST /api/entry/create", entryHandler.AddEntry)
	mux.HandleFunc("GET /api/entry/get", middleware.UserMiddleware(entryHandler.GetEntry))
	mux.HandleFunc("GET /api/entry/get-last-entry", entryHandler.GetLastEntryNumber)
	mux.HandleFunc("GET /api/entry/get-entry", middleware.AdminAuthMiddleware(entryHandler.GetUser))
	mux.HandleFunc("GET /api/entry/get-count", middleware.AdminAuthMiddleware(entryHandler.GetCountEntryHandler))
	mux.HandleFunc("PATCH /api/entry/{status}", middleware.UserOrAdminMiddleware(entryHandler.ChangeStatus))

	return mux, nil
}
