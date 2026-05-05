package models

type Template struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Type        string   `json:"type"`
	DesignType  string   `json:"designType,omitempty"`
	SuitableFor []string `json:"suitableFor,omitempty"`
}
