package service

import (
	"backend/internal/repository"
	"backend/models"
)

type UserService interface {
	AddUser(user models.User) (int, error)
	GetUser(id int) (models.User, error)
}

type UserServiceImpl struct {
	userRepository repository.UserRepository
}

func UserServiceImplInit(userRepo repository.UserRepository) UserService {
	return &UserServiceImpl{userRepo}
}

func (u *UserServiceImpl) AddUser(user models.User) (int, error) {
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
