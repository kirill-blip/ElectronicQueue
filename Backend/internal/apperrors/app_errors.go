package apperrors

import "errors"

var (
	InvalidPassword    = errors.New("password isn't valid")
	InvalidFirstName   = errors.New("first name isn't valid")
	InvalidLastName    = errors.New("last name isn't valid")
	ProblemWithServer  = errors.New("problem with server")
	ProblemWithDB      = errors.New("problem with database")
	InvalidLogin       = errors.New("invalid login. Login must contain only letters, numbers and symbols: - _")
	LenLogin           = errors.New("lenght of login must be between 6 and 25")
	InvalidData        = errors.New("invalid login or password")
	AdminNotFound      = errors.New("admin not found")
	InvalidToken       = errors.New("invalid refresh token")
	InvalidTokenId     = errors.New("admin_id not found in token")
	LogInWrongLogin    = errors.New("wrong login")
	LogInWrongPassword = errors.New("wrong password")
	ServerError        = errors.New("server error")
)

func FindErrorCode(err error) int {
	if err == InvalidPassword || err == InvalidLastName || err == InvalidFirstName || err == InvalidLogin || err == LenLogin {
		return 400
	}

	if err == InvalidData || err == InvalidToken || err == InvalidTokenId || err == AdminNotFound || err == LogInWrongPassword || err == LogInWrongLogin {
		return 401
	}

	return 500
}
