package utils

import (
	"regexp"
	"unicode"
	"unicode/utf8"
)

var russianOnlyRegex = regexp.MustCompile(`^[А-Яа-яЁё]+$`)

func LastFirstNameValid(name string) bool {
	if name == "" {
		return false
	}

	if !russianOnlyRegex.MatchString(name) {
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
