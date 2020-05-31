package web

import (
	"encoding/json"
	"net/http"
)

func ReadJSON(r *http.Request, data interface{}) error {
	return json.NewDecoder(r.Body).Decode(data)
}
