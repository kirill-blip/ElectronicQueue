package handlers

import (
	"backend/internal/apperrors"
	"backend/internal/service"
	"backend/internal/utils"
	"backend/models"
	"encoding/json"
	"github.com/golang-jwt/jwt/v5"
	"log/slog"
	"net/http"
	"strconv"
	"time"
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

	id, err := a.adminService.Login(logInData.Login, logInData.Password)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	cookie := &http.Cookie{
		Name:     "admin_id",
		Value:    strconv.Itoa(id),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	}

	http.SetCookie(w, cookie)

	utils.ResponseInJSON(w, http.StatusOK, id)
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

func (a *AdminHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	refreshToken := utils.ExtractToken(r)

	token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
		return []byte("REFRESH_SSECRETT"), nil
	})

	if err != nil || !token.Valid {
		slog.Warn(err.Error())

		utils.ErrorInJSON(w, http.StatusUnauthorized, apperrors.InvalidToken)
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		slog.Warn(err.Error())

		utils.ErrorInJSON(w, http.StatusUnauthorized, apperrors.InvalidToken)
		return
	}

	adminID, ok := claims["admin_id"].(int)
	if !ok {
		slog.Warn("Не нашел admin_id")

		utils.ErrorInJSON(w, http.StatusUnauthorized, apperrors.InvalidTokenId)
		return
	}

	newTokens, err := utils.CreateAccessToken(adminID)
	if err != nil {
		slog.Warn(err.Error())

		utils.ErrorInJSON(w, http.StatusInternalServerError, apperrors.ServerError)
		return
	}

	response := models.TokenResponse{
		AccessToken: newTokens,
	}

	utils.ResponseInJSON(w, http.StatusOK, response)
}

func (a *AdminHandler) GetAdminDesktop(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet || r.URL.Path != "/api/admin/get" {
		utils.ErrorInJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	slog.Info("GetAdminDesktop")

	adminIDValue := r.Context().Value("admin_id")
	adminID, ok := adminIDValue.(int)
	if !ok {
		slog.Info("admin_id not found or wrong type in context")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	admin, err := a.adminService.GetAdminDesktop(adminID)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	slog.Info("okok")
	slog.Info(admin.LastName, admin.FirstName, admin.Table)

	utils.ResponseInJSON(w, http.StatusOK, admin)
}
