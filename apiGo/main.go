package main

import (
	"fmt"
	"log"
	"net/http"
	"openmediacenter/apiGo/api"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/static"
	"openmediacenter/apiGo/videoparser"
)

func main() {
	fmt.Println("init OpenMediaCenter server")
	port := 8081

	config.Init()

	// todo some verbosity logger or sth
	fmt.Printf("Use verbose output: %t\n", config.GetConfig().General.VerboseLogging)
	fmt.Printf("Videopath prefix: %s\n", config.GetConfig().General.ReindexPrefix)

	database.InitDB()
	defer database.Close()

	api.AddVideoHandlers()
	api.AddSettingsHandlers()
	api.AddTagHandlers()
	api.AddActorsHandlers()
	api.AddTvshowHandlers()

	videoparser.SetupSettingsWebsocket()

	// add the static files
	static.ServeStaticFiles()

	api.ServerInit()

	fmt.Printf("OpenMediacenter server up and running on port %d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
