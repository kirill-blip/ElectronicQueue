package service

import (
	"backend/internal/repository"
	"backend/models"
)

type UserService interface {
	AddUser(user models.User) error
	GetUser(id int) (models.User, error)
}

type UserServiceImpl struct {
	userRepository repository.UserRepository
}

func UserServiceImplInit(userRepo repository.UserRepository) UserService {
	return &UserServiceImpl{userRepo}
}

func (u *UserServiceImpl) AddUser(user models.User) error {
	err := u.userRepository.AddUser(user)

	if err != nil {
		return err
	}

	return nil
}

func (u *UserServiceImpl) GetUser(id int) (models.User, error) {
	user, err := u.userRepository.GetUser(id)

	if err != nil {
		return models.User{}, err
	}

	return user, nil
}
