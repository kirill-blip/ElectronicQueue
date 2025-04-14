package service

import (
	"backend/internal/apperrors"
	"backend/internal/repository"
	"backend/internal/utils"
	"backend/models"
)

type AdminService interface {
	RegisterAdmin(admin models.Admin) error
	GetAdmins() ([]models.Admin, error)
}

type AdminServiceImpl struct {
	adminRepo repository.AdminRepository
}

func AdminServiceInit(adminRepo repository.AdminRepository) AdminService {
	return &AdminServiceImpl{adminRepo}
}

func (s *AdminServiceImpl) RegisterAdmin(admin models.Admin) error {
	if admin.TableNumber <= 0 {
		return apperrors.InvalidPassword
	}

	if !utils.LastFirstNameValid(admin.LastName) {
		return apperrors.InvalidLastName
	}

	if !utils.LastFirstNameValid(admin.FirstName) {
		return apperrors.InvalidFirstName
	}

	hashPassword, err := utils.HashPassword(admin.Password)
	if err != nil {
		return apperrors.ProblemWithServer
	}

	admin.Password = hashPassword

	err = s.adminRepo.AddAdmin(admin)

	if err != nil {
		return err
	}

	return nil
}

func (s *AdminServiceImpl) GetAdmins() ([]models.Admin, error) {
	admins, err := s.adminRepo.GetAdmins()
	if err != nil {
		return nil, err
	}

	return admins, nil
}
