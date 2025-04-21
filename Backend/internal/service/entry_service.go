package service

import (
	"backend/internal/apperrors"
	"backend/internal/repository"
	"backend/internal/utils"
	"backend/models"
)

var ticket int = 0

type EntryService interface {
	GenerateEntry(user models.User) (int, error)
	GetLastEntry() (int, error)
	GetEntry(id int) (models.Entry, error)
	GetUserService(adminId int) (models.GetEntry, error)
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

	ticket++

	user.Ticket = ticket

	userId, err := e.entryRepository.AddEntry(user)
	if err != nil {
		ticket--
		return 0, err
	}

	return userId, nil
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
