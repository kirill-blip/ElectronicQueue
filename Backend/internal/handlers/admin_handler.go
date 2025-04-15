package handlers

import (
	"backend/internal/apperrors"
	"backend/internal/service"
	"backend/internal/utils"
	"backend/models"
	"encoding/json"
	"log/slog"
	"net/http"
)

type AdminHandler struct {
	adminService service.AdminService
}

func NewAdminHandler(adminService service.AdminService) *AdminHandler {
	return &AdminHandler{adminService}
}

func (a *AdminHandler) RegisterAdmin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	admin := models.Admin{}

	err := json.NewDecoder(r.Body).Decode(&admin)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	err = a.adminService.RegisterAdmin(admin)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	response := models.Response{
		Message: "admin has been registered",
	}

	utils.ResponseInJSON(w, http.StatusCreated, response)

}

func (a *AdminHandler) LogInAdmin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	logInData := models.LogIn{}

	err := json.NewDecoder(r.Body).Decode(&logInData)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

}

func (a *AdminHandler) GetAdmins(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet || r.URL.Path != "/api/admin" {
		utils.ErrorInJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	admins, err := a.adminService.GetAdmins()
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, admins)
}
