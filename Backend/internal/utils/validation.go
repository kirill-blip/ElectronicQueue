package utils

import (
	"backend/internal/apperrors"
	"regexp"
	"unicode"
	"unicode/utf8"
)

var russianAndKazakhRegex = regexp.MustCompile(`^[А-Яа-яЁёӘәҒғҚқҢңҮүҰұӨөҺһ]+$`)

func LoginValid(login string) error {
	if login == "" {
		return apperrors.LenLogin
	}

	regex := `^[a-zA-Z0-9_-]{4,25}$`
	match, _ := regexp.MatchString(regex, login)

	if !match {
		return apperrors.InvalidLogin
	}

	return nil
}

func LastFirstNameValid(name string) bool {
	if name == "" {
		return false
	}

	if !russianAndKazakhRegex.MatchString(name) {
		return false
	}

	firstRune, _ := utf8.DecodeRuneInString(name)
	if !unicode.IsUpper(firstRune) {
		return false
	}

	for i, r := range name {
		if i == 0 {
			continue
		}
		if !unicode.IsLower(r) {
			return false
		}
	}

	return true
}

func ValidateKazakhstanPhone(phone string) bool {
	regex := `^\+7(700|701|702|705|707|708|747|771|775|776|777|778)\d{7}$`
	re := regexp.MustCompile(regex)
	return re.MatchString(phone)
}
