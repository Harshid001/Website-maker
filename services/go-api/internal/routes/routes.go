package routes

import (
	"net/http"

	"shopcraft-go-api/internal/handlers"
)

func NewRouter() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/health", handlers.Health)
	mux.HandleFunc("/api/templates", handlers.Templates)
	mux.HandleFunc("/api/projects", handlers.Projects)
	return mux
}
