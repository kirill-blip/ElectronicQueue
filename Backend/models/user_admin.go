package models

type Admin struct {
	Login       string `json:"login"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Password    string `json:"password"`
	TableNumber int    `json:"table_number"`
}

type User struct {
	NumberPhone string `json:"number_phone"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
}

type LogIn struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}
