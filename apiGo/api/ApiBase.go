package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"openmediacenter/apiGo/api/oauth"
)

const APIPREFIX = "/api"

const (
	VideoNode    = iota
	TagNode      = iota
	SettingsNode = iota
	ActorNode    = iota
	TVShowNode   = iota
)

type actionStruct struct {
	Action string
}

type Handler struct {
	action    string
	handler   func() []byte
	arguments interface{}
	apiNode   int
}

var handlers []Handler

func AddHandler(action string, apiNode int, n interface{}, h func() []byte) {
	// append new handler to the handlers
	handlers = append(handlers, Handler{action, h, n, apiNode})
}

func ServerInit() {
	http.Handle(APIPREFIX+"/video", oauth.ValidateToken(handlefunc, VideoNode))
	http.Handle(APIPREFIX+"/tags", oauth.ValidateToken(handlefunc, TagNode))
	http.Handle(APIPREFIX+"/settings", oauth.ValidateToken(handlefunc, SettingsNode))
	http.Handle(APIPREFIX+"/actor", oauth.ValidateToken(handlefunc, ActorNode))
	http.Handle(APIPREFIX+"/tvshow", oauth.ValidateToken(handlefunc, TVShowNode))

	// initialize oauth service and add corresponding auth routes
	oauth.InitOAuth()
}

func handleAPICall(action string, requestBody string, apiNode int) []byte {
	for i := range handlers {
		if handlers[i].action == action && handlers[i].apiNode == apiNode {
			// call the handler and return

			if handlers[i].arguments != nil {
				// decode the arguments to the corresponding arguments object
				err := json.Unmarshal([]byte(requestBody), &handlers[i].arguments)
				if err != nil {
					fmt.Printf("failed to decode arguments of action %s :: %s\n", action, requestBody)
				}
			}

			return handlers[i].handler()
		}
	}
	fmt.Printf("no handler found for Action: %d/%s\n", apiNode, action)
	return nil
}

func handlefunc(rw http.ResponseWriter, req *http.Request, node int) {
	// only allow post requests
	if req.Method != "POST" {
		return
	}

	buf := new(bytes.Buffer)
	buf.ReadFrom(req.Body)
	body := buf.String()

	var t actionStruct
	err := json.Unmarshal([]byte(body), &t)
	if err != nil {
		fmt.Println("failed to read action from request! :: " + body)
	}

	rw.Write(handleAPICall(t.Action, body, node))
}
