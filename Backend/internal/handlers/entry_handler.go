package handlers

import (
	"backend/internal/apperrors"
	"backend/internal/service"
	"backend/internal/utils"
	"backend/models"
	"crypto/tls"
	"encoding/json"
	"fmt"
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

	// Notify(w, entry.EntryId)

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

	if body != "accept" && body != "cancel" && body != "cancelbyuser" {
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
		ID int `json:"entry_id"`
	}

	err := json.NewDecoder(r.Body).Decode(&entry)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	err = e.entryService.ChangeStatusService(entry.ID, status)
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	// Notify(w, entry.ID)

	utils.ResponseInJSON(w, http.StatusOK, map[string]string{"status": status})
}

func (e *EntryHandler) GetDashBoard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	board, err := e.entryService.GetDashBoardService()
	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)
		return
	}

	utils.ResponseInJSON(w, http.StatusOK, board)
}

func Notify(w http.ResponseWriter, id int) {
	url := fmt.Sprintf("https://host.docker.internal:7069/api/notify/%d", id)

	client := &http.Client{
		Transport: &http.Transport{
			TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
		},
	}

	resp, err := client.Get(url)
	if err != nil {
		slog.Error("Error making request:", "error", err)
	}

	if resp != nil{
		defer resp.Body.Close()
	}

	slog.Info("Response status:", "status", resp.Status)
}
