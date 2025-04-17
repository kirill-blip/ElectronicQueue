package handlers

import (
	"backend/internal/apperrors"
	"backend/internal/service"
	"backend/internal/utils"
	"backend/models"
	"log/slog"
	"net/http"
)

type EntryHandler struct {
	entryService service.EntryService
}

func NewEntryHandler(entryService service.EntryService) *EntryHandler {
	return &EntryHandler{entryService}
}

func (u *EntryHandler) GenerateEntry(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userIdValue := r.Context().Value("user")
	userId, ok := userIdValue.(int)

	if !ok {
		http.Error(w, "UserId not found", http.StatusBadRequest)
		return
	}

	entry, err := u.entryService.GenerateEntry(userId)

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)

		return
	}

	utils.ResponseInJSON(w, http.StatusOK, entry)
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

	if entry.Status != models.Waiting {
		utils.ResponseInJSON(w, http.StatusOK, models.Entry{})
	}

	if err != nil {
		slog.Warn(err.Error())

		statusCode := apperrors.FindErrorCode(err)

		utils.ErrorInJSON(w, statusCode, err)

		return
	}

	utils.ResponseInJSON(w, http.StatusOK, entry)
}
