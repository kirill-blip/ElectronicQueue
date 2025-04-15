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

	response, err := a.adminService.Login(logInData.Login, logInData.Password)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, response)
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

	adminIDFloat, ok := claims["admin_id"].(float64)
	if !ok {
		slog.Warn("Не нашел admin_id")

		utils.ErrorInJSON(w, http.StatusUnauthorized, apperrors.InvalidTokenId)
		return
	}

	adminID := int(adminIDFloat)

	newTokens, err := utils.CreateTokens(adminID)
	if err != nil {
		slog.Warn(err.Error())

		utils.ErrorInJSON(w, http.StatusInternalServerError, apperrors.ServerError)
		return
	}

	response := models.TokenResponse{
		AccessToken:  newTokens.AccessToken,
		RefreshToken: newTokens.RefreshToken,
	}

	utils.ResponseInJSON(w, http.StatusOK, response)
}
