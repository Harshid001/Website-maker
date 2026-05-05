package main

import (
	"log"
	"net/http"

	"shopcraft-go-api/internal/routes"
)

func main() {
	router := routes.NewRouter()
	log.Println("ShopCraft optional Go API running on :8081")
	if err := http.ListenAndServe(":8081", router); err != nil {
		log.Fatal(err)
	}
}
