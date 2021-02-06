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

			if &handlers[i].arguments != nil {
				// decode the arguments to the corresponding arguments object
				err := json.Unmarshal([]byte(requestBody), &handlers[i].arguments)
				if err != nil {
					fmt.Printf("failed to decode arguments of action %s\n", action)
				}
			}

			return handlers[i].handler()
		}
	}
	fmt.Println("no handler found for Action: " + action)
	return nil
}

const APIPREFIX = "/api"

func ServerInit() {
	http.Handle(APIPREFIX+"/video", http.HandlerFunc(handlefunc))
	http.Handle(APIPREFIX+"/tag", http.HandlerFunc(handlefunc))
	http.Handle(APIPREFIX+"/settings", http.HandlerFunc(handlefunc))

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

	var t action_struct
	err := json.Unmarshal([]byte(body), &t)
	if err != nil {
		panic(err)
	}

	rw.Write(handleAPICall(t.Action, body))
}

type action_struct struct {
	Action string
}
