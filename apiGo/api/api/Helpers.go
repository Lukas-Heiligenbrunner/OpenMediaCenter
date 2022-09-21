package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func Jsonify(v interface{}) []byte {
	// Jsonify results
	str, err := json.Marshal(v)
	if err != nil {
		fmt.Println("Error while Jsonifying return object: " + err.Error())
	}
	return str
}

// DecodeRequest decodes the request
func DecodeRequest(request *http.Request, arg interface{}) error {
	buf := new(bytes.Buffer)
	buf.ReadFrom(request.Body)
	body := buf.String()

	err := json.Unmarshal([]byte(body), &arg)
	if err != nil {
		fmt.Println("JSON decode Error" + err.Error())
	}

	return err
}
