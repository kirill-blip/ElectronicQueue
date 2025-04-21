package models

type EntryAdminId struct {
	EntryId int `json:entry_id`
	AdminId int `json:admin_id`
}

type Admin struct {
	ID          int    `json:"id,omitempty"`
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
	Ticket      int    `json:"ticket_number,omitempty"`
}

type UserId struct {
	Id int `json:"id"`
}

type LogIn struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

type AdminPanel struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Table     int    `json:"table_number"`
}

type GetEntry struct {
	EntryId     int    `json:"entry_id"`
	UserId      int    `json:"user_id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	NumberPhone string `json:"number_phone"`
}
