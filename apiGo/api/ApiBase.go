package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gopkg.in/oauth2.v3"
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

type HandlerInfo struct {
	ID    string
	Token string
	Data  map[string]interface{}
}

type actionStruct struct {
	Action string
}

type Handler struct {
	action  string
	handler func(info *HandlerInfo) []byte
	apiNode int
}

var handlers = make(map[string]Handler)

func AddHandler(action string, apiNode int, h func(info *HandlerInfo) []byte) {
	// append new handler to the handlers
	handlers[fmt.Sprintf("%s/%d", action, apiNode)] = Handler{action, h, apiNode}
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

func handleAPICall(action string, requestBody string, apiNode int, info *HandlerInfo) []byte {
	handler, ok := handlers[fmt.Sprintf("%s/%d", action, apiNode)]
	if !ok {
		// handler doesn't exist!
		fmt.Printf("no handler found for Action: %d/%s\n", apiNode, action)
		return nil
	}

	// check if info even exists
	if info == nil {
		info = &HandlerInfo{}
	}

	// parse the arguments
	var args map[string]interface{}
	err := json.Unmarshal([]byte(requestBody), &args)

	if err != nil {
		fmt.Printf("failed to decode arguments of action %s :: %s\n", action, requestBody)
	} else {
		// check if map has an action
		if _, ok := args["action"]; ok {
			delete(args, "action")
		}

		info.Data = args
	}

	// call the handler
	return handler.handler(info)
}

func handlefunc(rw http.ResponseWriter, req *http.Request, node int, tokenInfo *oauth2.TokenInfo) {
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

	// load userid from received token object
	id := (*tokenInfo).GetClientID()

	userinfo := &HandlerInfo{
		ID:    id,
		Token: (*tokenInfo).GetCode(),
	}

	rw.Write(handleAPICall(t.Action, body, node, userinfo))
}
