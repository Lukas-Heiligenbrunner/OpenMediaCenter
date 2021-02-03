package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type Handler struct {
	action    string
	handler   func() []byte
	arguments interface{}
}

var handlers []Handler

func AddHandler(action string, n interface{}, h func() []byte) {
	// append new handler to the handlers
	handlers = append(handlers, Handler{action, h, n})
}

func handleAPICall(action string, requestBody string) []byte {
	for i := range handlers {
		if handlers[i].action == action {
			// call the handler and return

			// decode the arguments to the corresponding arguments object
			err := json.Unmarshal([]byte(requestBody), &handlers[i].arguments)
			if err != nil {
				fmt.Println("failed to decode arguments")
			}

			return handlers[i].handler()
		}
	}
	fmt.Println("no handler found!")
	return nil
}

func ServerInit() {
	http.Handle("/video", http.HandlerFunc(handlefunc))

	log.Fatal(http.ListenAndServe(":8080", nil))
}

func handlefunc(rw http.ResponseWriter, req *http.Request) {
	// only allow post requests
	if req.Method != "POST" {
		return
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	body := buf.String()

	//decoder := json.NewDecoder(body)
	var t action_struct
	//err := decoder.Decode(&t)
	err := json.Unmarshal([]byte(body), &t)
	if err != nil {
		panic(err)
	}
	fmt.Println("api call to action: " + t.Action)

	rw.Write(handleAPICall(t.Action, body))
}

type action_struct struct {
	Action string
}
