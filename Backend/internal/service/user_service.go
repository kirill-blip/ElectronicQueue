package service

import (
	"backend/internal/apperrors"
	"backend/internal/repository"
	"backend/internal/utils"
	"backend/models"
)

type UserService interface {
	AddUser(user models.User) (int, error)
	GetUser(id int) (models.User, error)
	UpdateUserService(user models.User, userId int) error
}

type UserServiceImpl struct {
	userRepository repository.UserRepository
}

func UserServiceImplInit(userRepo repository.UserRepository) UserService {
	return &UserServiceImpl{userRepo}
}

func (u *UserServiceImpl) AddUser(user models.User) (int, error) {
	if !utils.LastFirstNameValid(user.FirstName) {
		return 0, apperrors.InvalidFirstName
	}

	if !utils.LastFirstNameValid(user.LastName) {
		return 0, apperrors.InvalidLastName
	}

	if !utils.ValidateKazakhstanPhone(user.NumberPhone) {
		return 0, apperrors.InvalidPhone
	}

	err := u.userRepository.AddUser(user)

	if err != nil {
		return 0, err
	}

	id := u.userRepository.GetUserIdByPhone(user.NumberPhone)

	return id, nil
}

func (u *UserServiceImpl) GetUser(id int) (models.User, error) {
	user, err := u.userRepository.GetUser(id)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}

func (u *UserServiceImpl) UpdateUserService(user models.User, userId int) error {
	if !utils.LastFirstNameValid(user.FirstName) {
		return apperrors.InvalidFirstName
	}

	if !utils.LastFirstNameValid(user.LastName) {
		return apperrors.InvalidLastName
	}

	if !utils.ValidateKazakhstanPhone(user.NumberPhone) {
		return apperrors.InvalidPhone
	}

	err := u.userRepository.UpdateUserRepo(user, userId)

	return err
}
