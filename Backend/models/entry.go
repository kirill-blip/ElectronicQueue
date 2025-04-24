package models

import "time"

const (
	Waiting        = "Waiting"
	Processing     = "Processing"
	CanceledByUser = "CanceledByUser"
	Canceled       = "Canceled"
	Accepted       = "Accepted"
)

type Entry struct {
	Id           int
	TicketNumber int       `json:"ticket_number"`
	UserId       int       `json:"user_id"`
	AdminId      int       `json:"admin_id"`
	Date         time.Time `json:"date"`
	Status       string    `json:"status"`
}

type Table struct {
	TableNumber  int `json:"table_number"`
	TicketNumber int `json:"ticket_number"`
}
