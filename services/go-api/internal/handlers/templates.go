package handlers

import (
	"encoding/json"
	"net/http"

	"shopcraft-go-api/internal/models"
)

func Templates(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode([]models.Template{
		{
			ID:          "minimal-clean-landing",
			Title:       "Minimal Clean Landing",
			Type:        "website",
			DesignType:  "Minimal",
			SuitableFor: []string{"Portfolio", "Business", "Consultant"},
		},
	})
}
