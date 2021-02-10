package main

import (
	"fmt"
	"openmediacenter/apiGo/api"
	"openmediacenter/apiGo/database"
)

func main() {
	fmt.Println("init OpenMediaCenter server")

	database.InitDB()
	defer database.Close()

	api.AddVideoHandlers()
	api.AddSettingsHandlers()
	api.AddTagHandlers()
	api.AddActorsHandlers()

	api.ServerInit(8081)
}
