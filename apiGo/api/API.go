package api

import (
	gws "github.com/gowebsecure/goWebSecure-go"
	"github.com/gowebsecure/goWebSecure-go/oauth"
	"openmediacenter/apiGo/database/settings"
)

const (
	VideoNode    = iota
	TagNode      = iota
	SettingsNode = iota
	ActorNode    = iota
	TVShowNode   = iota
)

func Init() {
	AddVideoHandlers()
	AddSettingsHandlers()
	AddTagHandlers()
	AddActorsHandlers()
	AddTvshowHandlers()

	gws.AddAPINode("video", VideoNode, true)
	gws.AddAPINode("tags", TagNode, true)
	gws.AddAPINode("settings", SettingsNode, true)
	gws.AddAPINode("actor", ActorNode, true)
	gws.AddAPINode("tvshow", TVShowNode, true)

	// serverinit is blocking
	gws.ServerInit(func(id string) (oauth.CustomClientInfo, error) {
		password := settings.GetPassword()
		// if password not set assign default password
		if password == nil {
			defaultpassword := "openmediacenter"
			password = &defaultpassword
		}

		clientinfo := oauth.CustomClientInfo{
			ID:     "openmediacenter",
			Secret: *password,
			Domain: "http://localhost:8081",
			UserID: "openmediacenter",
		}

		return clientinfo, nil
	}, 8080)
}
