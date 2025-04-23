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

type EntryHandler struct {
	entryService service.EntryService
}

func NewEntryHandler(entryService service.EntryService) *EntryHandler {
	return &EntryHandler{entryService}
}

func (u *EntryHandler) AddEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	userId, err := u.entryService.GenerateEntry(user)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	cookie := http.Cookie{
		Name:     "user",
		Value:    strconv.Itoa(userId),
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	}

	http.SetCookie(w, &cookie)

	reps := models.Response{Message: "Success"}

	utils.ResponseInJSON(w, http.StatusOK, reps)
}

func (u *EntryHandler) GenerateEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIdValue := r.Context().Value("user")
	userId, ok := userIdValue.(int)

	if !ok {
		http.Error(w, "UserId not found", http.StatusBadRequest)
		return
	}

	entry, err := u.entryService.GenerateEntryRepeat(userId)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)

		return
	}

	utils.ResponseInJSON(w, http.StatusOK, map[string]int{"ticket_number": entry})
}

func (e *EntryHandler) GetLastEntryNumber(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	entry, err := e.entryService.GetLastEntry()

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, entry)
}

func (e *EntryHandler) GetEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIdValue := r.Context().Value("user")
	userId, ok := userIdValue.(int)

	if !ok {
		http.Error(w, "UserId not found", http.StatusBadRequest)
		return
	}

	entry, err := e.entryService.GetEntry(userId)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)

		return
	}

	utils.ResponseInJSON(w, http.StatusOK, entry)
}

func (e *EntryHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	adminIdValue := r.Context().Value("admin_id")
	adminId, ok := adminIdValue.(int)

	if !ok {
		http.Error(w, "AdminId not found", http.StatusBadRequest)
		return
	}

	entry, err := e.entryService.GetUserService(adminId)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, entry)
}

func (e *EntryHandler) GetCountEntryHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	count, err := e.entryService.GetCountEntryService()
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, map[string]int{"count": count})
}

func (e *EntryHandler) ChangeStatus(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	body := r.PathValue("status")

	if body != "accept" && body != "cancel" {
		utils.ErrorInJSON(w, 401, apperrors.InvalidStatus)
		return
	}

	var status string

	if body == "accept" {
		status = "Accepted"
	} else if body == "cancelbyuser" {
		status = "CanceledByUser"
	} else {
		status = "Canceled"
	}

	var entry struct {
		id int `json:"entry_id"`
	}

	err := json.NewDecoder(r.Body).Decode(&entry)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	err = e.entryService.ChangeStatusService(entry.id, status)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, map[string]string{"status": status})
}
