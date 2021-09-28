package main

import (
	"fmt"
	"openmediacenter/apiGo/api"
	api2 "openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/static"
	"openmediacenter/apiGo/videoparser"
	"os"
	"os/signal"
)

func main() {
	fmt.Println("init OpenMediaCenter server")
	const port uint16 = 8081
	errc := make(chan error, 1)

	config.Init()

	// todo some verbosity logger or sth
	fmt.Printf("Use verbose output: %t\n", config.GetConfig().General.VerboseLogging)
	fmt.Printf("Videopath prefix: %s\n", config.GetConfig().General.ReindexPrefix)

	err := database.InitDB()
	if err != nil {
		errc <- err
	}
	defer database.Close()

	api.AddHandlers()

	videoparser.SetupSettingsWebsocket()

	// add the static files
	static.ServeStaticFiles()

	// init api
	go func() {
		errc <- api2.ServerInit(port)
	}()

	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, os.Interrupt)
	select {
	case err := <-errc:
		fmt.Printf("failed to serve: %v\n", err)
	case sig := <-sigs:
		fmt.Printf("terminating server: %v\n", sig)
	}
}
