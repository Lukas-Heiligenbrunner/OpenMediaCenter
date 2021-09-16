package api

import (
	"fmt"
	"net/http"
)

const (
	VideoNode    = "video"
	TagNode      = "tag"
	SettingsNode = "setting"
	ActorNode    = "actor"
	TVShowNode   = "tv"
	LoginNode    = "login"
)

//type HandlerInfo struct {
//	ID    string
//	Token string
//	Data  map[string]interface{}
//}

//type actionStruct struct {
//	Action string
//}

//type Handler struct {
//	action  string
//	handler api.PermUser, func(context api.Context)
//	apiNode int
//}

func AddHandler(action string, apiNode string, perm uint8, handler func(ctx Context)) {
	http.Handle(fmt.Sprintf("/api/%s/%s", apiNode, action), http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		tokenheader := request.Header.Get("Token")

		id := -1
		permid := PermUnauthorized

		// check token if token provided
		if tokenheader != "" {
			id, permid = TokenValid(request.Header.Get("Token"))
		}

		ctx := &apicontext{writer: writer, responseWritten: false, request: request, userid: id, permid: permid}

		// check if rights are sufficient to perform the action
		if permid <= perm {
			handler(ctx)

			if !ctx.responseWritten {
				// none of the response functions called so send default response
				ctx.Error("Unknown server Error occured")
				writer.WriteHeader(501)
			}
		} else {
			ctx.Error("insufficient permissions")
			writer.WriteHeader(501)
		}
	}))
}

func ServerInit() {
	// initialize auth service and add corresponding auth routes
	InitOAuth()
}

//func handleAPICall(action string, requestBody string, apiNode int, context api.Context)  {
//	handler, ok := handlers[fmt.Sprintf("%s/%d", action, apiNode)]
//	if !ok {
//		// handler doesn't exist!
//		fmt.Printf("no handler found for Action: %d/%s\n", apiNode, action)
//		return nil
//	}
//
//	// check if info even exists
//	if info == nil {
//		info = &HandlerInfo{}
//	}
//
//	// parse the arguments
//	var args map[string]interface{}
//	err := json.Unmarshal([]byte(requestBody), &args)
//
//	if err != nil {
//		fmt.Printf("failed to decode arguments of action %s :: %s\n", action, requestBody)
//	} else {
//		// check if map has an action
//		if _, ok := args["action"]; ok {
//			delete(args, "action")
//		}
//
//		info.Data = args
//	}
//
//	// call the handler
//	return handler.handler(info)
//}
//
//func handlefunc(rw http.ResponseWriter, req *http.Request, node int, tokenInfo *oauth2.TokenInfo) {
//	// only allow post requests
//	if req.Method != "POST" {
//		return
//	}
//
//	buf := new(bytes.Buffer)
//	buf.ReadFrom(req.Body)
//	body := buf.String()
//
//	var t actionStruct
//	err := json.Unmarshal([]byte(body), &t)
//	if err != nil {
//		fmt.Println("failed to read action from request! :: " + body)
//	}
//
//	// load userid from received token object
//	id := (*tokenInfo).GetClientID()
//
//	userinfo := &HandlerInfo{
//		ID:    id,
//		Token: (*tokenInfo).GetCode(),
//	}
//
//	rw.Write(handleAPICall(t.Action, body, node, userinfo))
//}
