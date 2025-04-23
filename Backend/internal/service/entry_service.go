package service

import (
	"backend/internal/apperrors"
	"backend/internal/repository"
	"backend/internal/utils"
	"backend/models"
	"sync"
)

var (
	ticket int = 1
	Mu     sync.Mutex
)

type EntryService interface {
	GenerateEntry(user models.User) (int, error)
	GenerateEntryRepeat(userId int) (int, error)
	GetLastEntry() (int, error)
	GetEntry(id int) (models.Entry, error)
	GetUserService(adminId int) (models.GetEntry, error)
	GetCountEntryService() (int, error)
}

type EntryServiceImpl struct {
	userRepo        repository.UserRepository
	adminRepo       repository.AdminRepository
	entryRepository repository.EntryRepository
}

func EntryServiceImplInit(entryRepo repository.EntryRepository, userRepo repository.UserRepository, adminRepo repository.AdminRepository) EntryService {
	return &EntryServiceImpl{
		userRepo,
		adminRepo,
		entryRepo,
	}
}

func (e *EntryServiceImpl) GetEntry(userId int) (models.Entry, error) {
	entry, err := e.entryRepository.GetEntry(userId)

	if err != nil {
		return models.Entry{}, err
	}

	return entry, nil
}

func (e *EntryServiceImpl) GenerateEntry(user models.User) (int, error) {
	if !utils.LastFirstNameValid(user.FirstName) {
		return 0, apperrors.InvalidFirstName
	}

	if !utils.LastFirstNameValid(user.LastName) {
		return 0, apperrors.InvalidLastName
	}

	if !utils.ValidateKazakhstanPhone(user.NumberPhone) {
		return 0, apperrors.InvalidPhone
	}

	user.Ticket = ticket

	Mu.Lock()
	defer Mu.Unlock()

	userId, err := e.entryRepository.AddEntry(user)
	if err != nil {
		return 0, err
	}

	ticket++

	return userId, nil
}

func (e *EntryServiceImpl) GenerateEntryRepeat(userId int) (int, error) {
	if _, err := e.entryRepository.GetEntry(userId); err != apperrors.UserNotFound && err != nil {
		return 0, apperrors.EntryExists
	}

	var entry models.Entry

	entry.UserId = userId
	entry.TicketNumber = ticket

	Mu.Lock()
	defer Mu.Unlock()

	err := e.entryRepository.GenerateEntryRepo(entry)

	if err != nil {
		return 0, err
	}

	ticket++

	return ticket, nil
}

func (e *EntryServiceImpl) GetLastEntry() (int, error) {
	entry, err := e.entryRepository.GetLastEntry()

	if err != nil {
		return entry, err
	}

	return entry, nil
}

func (e *EntryServiceImpl) GetUserService(adminId int) (models.GetEntry, error) {
	entry, err := e.entryRepository.GetUserRepo(adminId)
	if err != nil {
		return models.GetEntry{}, err
	}

	return entry, nil
}

func (e *EntryServiceImpl) GetCountEntryService() (int, error) {
	return e.entryRepository.GetCountEntry()
}
