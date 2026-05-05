package handlers

import (
	"encoding/json"
	"net/http"

	"shopcraft-go-api/internal/models"
)

func Projects(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]models.Project{})
}
