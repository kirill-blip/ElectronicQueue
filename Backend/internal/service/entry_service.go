package service

import (
	"backend/internal/repository"
	"backend/models"
	"time"
)

type EntryService interface {
	GenerateEntry(int) (models.Entry, error)
	GetLastEntry() (models.Entry, error)
	GetEntry(int) (models.Entry, error)
}

func (e *EntryServiceImpl) GetEntry(userId int) (models.Entry, error) {
	entry, err := e.entryRepository.GetEntry(userId)

	if err != nil {
		return models.Entry{}, err
	}

	return entry, nil
}

type EntryServiceImpl struct {
	entryRepository repository.EntryRepository
}

func EntryServiceImplInit(entryRepo repository.EntryRepository) EntryService {
	return &EntryServiceImpl{entryRepo}
}

func (e *EntryServiceImpl) GenerateEntry(userId int) (models.Entry, error) {
	lastTicketNumber, err := e.GetLastEntry()

	if err != nil {
		return models.Entry{}, err
	}

	entry := models.Entry{
		TicketNumber: lastTicketNumber.TicketNumber + 1,
		UserId:       userId,
		AdminId:      0,
		Date:         time.Now(),
		Status:       models.Waiting,
	}

	entry, err = e.entryRepository.AddEntry(entry)

	if err != nil {
		return models.Entry{}, err
	}

	return entry, nil
}

func (e *EntryServiceImpl) GetLastEntry() (models.Entry, error) {
	entry, err := e.entryRepository.GetLastEntry()

	if err != nil {
		return entry, err
	}

	return entry, nil
}
