package models

type Admin struct {
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Password    string `json:"password"`
	TableNumber int    `json:"table_number"`
}
