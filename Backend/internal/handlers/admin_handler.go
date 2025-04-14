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

	utils.ResponseInJSON(w, http.StatusCreated, "admin has been registered")

}

func (a *AdminHandler) GetAdmins(w http.ResponseWriter, r *http.Request) {
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
