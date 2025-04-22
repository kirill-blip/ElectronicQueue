package handlers

import (
	"backend/internal/apperrors"
	"backend/internal/service"
	"backend/internal/utils"
	"backend/models"
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"time"
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

	id, err := u.userService.AddUser(user)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	response := models.Response{
		Message: "User has been added",
	}

	cookie := &http.Cookie{
		Name:     "user",
		Value:    strconv.Itoa(id),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	}

	http.SetCookie(w, cookie)

	utils.ResponseInJSON(w, http.StatusOK, response)
}

func (u *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIdValue := r.Context().Value("user")
	userId, ok := userIdValue.(int)

	if !ok {
		http.Error(w, "UserId undefined", http.StatusNotFound)
		return
	}

	user, err := u.userService.GetUser(userId)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, user)
}

func (u *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIdValue := r.Context().Value("user")
	userId, ok := userIdValue.(int)

	if !ok {
		http.Error(w, "UserId undefined", http.StatusNotFound)
		return
	}

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)

		return
	}

	err = u.userService.UpdateUserService(user, userId)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, user)
}
