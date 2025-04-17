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
	GetAdmin(int) (models.AdminPanel, error)
	Login(login, password string) (int, error)
	GetAdminDesktop(adminID int) (models.AdminPanel, error)
}

type AdminServiceImpl struct {
	adminRepo repository.AdminRepository
}

func AdminServiceInit(adminRepo repository.AdminRepository) AdminService {
	return &AdminServiceImpl{adminRepo}
}

func (s *AdminServiceImpl) GetAdmin(id int) (models.AdminPanel, error) {
	user, err := s.adminRepo.GetAdminForPanel(id)

	if err != nil {
		return models.AdminPanel{}, err
	}

	return user, nil
}

func (s *AdminServiceImpl) RegisterAdmin(admin models.Admin) error {
	if err := utils.LoginValid(admin.Login); err != nil {
		return err
	}

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

func (s *AdminServiceImpl) Login(login, password string) (int, error) {
	admin, err := s.adminRepo.GetAdmin(login)
	if err != nil {
		return 0, err
	}

	if exists := utils.CheckPasswordHash(password, admin.Password); !exists {
		return 0, apperrors.LogInWrongPassword
	}

	return admin.ID, nil
}

func (s *AdminServiceImpl) GetAdminDesktop(adminID int) (models.AdminPanel, error) {
	if adminID <= 0 {
		return models.AdminPanel{}, apperrors.ProblemWithDB
	}

	admin, err := s.adminRepo.GetAdminForPanel(adminID)
	if err != nil {
		return models.AdminPanel{}, err
	}

	return admin, nil
}
