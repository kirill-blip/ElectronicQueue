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

type UserHandler struct {
	userService service.UserService
}

func NewUserHandler(userService service.UserService) *UserHandler {
	return &UserHandler{userService}
}

func (u *UserHandler) AddUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	user := models.User{}

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)

		return
	}

	err = u.userService.AddUser(user)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	response := models.Response{
		Message: "User has been added",
	}

	utils.ResponseInJSON(w, http.StatusOK, response)
}

func (u *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var userId models.UserId

	err := json.NewDecoder(r.Body).Decode(&userId)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	user, err := u.userService.GetUser(userId.Id)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, user)
}
