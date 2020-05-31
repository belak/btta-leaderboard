package web

import (
	"encoding/json"
	"net/http"
)

// Respond converts a Go value to JSON and sends it to the client.
func WriteJSON(w http.ResponseWriter, data interface{}, statusCode int) error {
	// Respond with the provided JSON.
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(statusCode)

	// Convert the response value to JSON.
	return json.NewEncoder(w).Encode(data)
}

func WriteString(w http.ResponseWriter, data string, statusCode int) error {
	w.WriteHeader(statusCode)
	_, err := w.Write([]byte(data))
	return err
}

func WriteError(w http.ResponseWriter, err error, statusCode int) error {
	return WriteString(w, err.Error(), statusCode)
}

func WriteStatus(w http.ResponseWriter, statusCode int) error {
	w.WriteHeader(statusCode)
	return nil
}

func WriteInternalError(w http.ResponseWriter, err error) error {
	return WriteError(w, err, http.StatusInternalServerError)
}
