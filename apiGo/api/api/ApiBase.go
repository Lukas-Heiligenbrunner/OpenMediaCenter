package api

import (
	"fmt"
	"net/http"
	"openmediacenter/apiGo/database/settings"
)

const (
	VideoNode    = "video"
	TagNode      = "tags"
	SettingsNode = "settings"
	ActorNode    = "actor"
	TVShowNode   = "tv"
	LoginNode    = "login"
)

func AddHandler(action string, apiNode string, perm uint8, handler func(ctx Context)) {
	http.Handle(fmt.Sprintf("/api/%s/%s", apiNode, action), http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		srvPwd := settings.GetPassword()
		if srvPwd == nil {
			// no password set
			ctx := &apicontext{writer: writer, responseWritten: false, request: request, userid: -1, permid: PermUnauthorized}
			callHandler(ctx, handler, writer)
		} else {
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
				callHandler(ctx, handler, writer)
			} else {
				ctx.Error("insufficient permissions")
			}
		}
	}))
}

func callHandler(ctx *apicontext, handler func(ctx Context), writer http.ResponseWriter) {
	handler(ctx)

	if !ctx.responseWritten {
		// none of the response functions called so send default response
		ctx.Error("Unknown server Error occured")
		writer.WriteHeader(501)
	}
}

func ServerInit() {
	// initialize auth service and add corresponding auth routes
	InitOAuth()
}
