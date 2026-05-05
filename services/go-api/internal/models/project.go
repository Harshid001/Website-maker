package models

type Project struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Type       string `json:"type"`
	TemplateID string `json:"templateId,omitempty"`
}
