package apperrors

import "errors"

var (
	InvalidPassword   = errors.New("password isn't valid")
	InvalidFirstName  = errors.New("first name isn't valid")
	InvalidLastName   = errors.New("last name isn't valid")
	ProblemWithServer = errors.New("problem with server")
	ProblemWithDB     = errors.New("problem with database")
)

func FindErrorCode(err error) int {
	if err == InvalidPassword || err == InvalidLastName || err == InvalidFirstName {
		return 400
	}

	return 500
}
