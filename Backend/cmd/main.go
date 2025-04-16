package main

import (
	"backend/internal/db"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"fmt"
	"log/slog"
	"net/http"
)

func HomePage(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func main() {
	fmt.Println("Hello world!") // Эта функция выводит предложение "Hello world"

	database, err := db.ConnectDb()
	if err != nil {
		panic(err)
	}
	defer database.Close()

	mux, _ := handlers.InitHandler(database)

	corsMux := middleware.CorsMiddleware(mux)

	http.ListenAndServe(":8080", corsMux)
	slog.Info("Server started in port 8080")
}
