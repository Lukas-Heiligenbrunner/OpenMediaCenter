package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"openmediacenter/apiGo/api"
	"openmediacenter/apiGo/database"
	settings2 "openmediacenter/apiGo/database/settings"
	"openmediacenter/apiGo/static"
	"openmediacenter/apiGo/videoparser"
)

func main() {
	fmt.Println("init OpenMediaCenter server")
	port := 8081

	db, verbose, pathPrefix := handleCommandLineArguments()
	// todo some verbosity logger or sth

	fmt.Printf("Use verbose output: %t\n", verbose)
	fmt.Printf("Videopath prefix: %s\n", *pathPrefix)

	// set pathprefix in database settings object
	database.SettingsVideoPrefix = *pathPrefix

	database.InitDB(db)
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

func handleCommandLineArguments() (*database.DatabaseConfig, bool, *string) {
	dbhostPtr := flag.String("DBHost", "127.0.0.1", "database host name")
	dbPortPtr := flag.Int("DBPort", 3306, "database port")
	dbUserPtr := flag.String("DBUser", "mediacenteruser", "database username")
	dbPassPtr := flag.String("DBPassword", "mediapassword", "database username")
	dbNamePtr := flag.String("DBName", "mediacenter", "database name")

	verbosePtr := flag.Bool("v", true, "Verbose log output")

	pathPrefix := flag.String("ReindexPrefix", "/var/www/openmediacenter", "Prefix path for videos to reindex")

	disableTVShowSupport := flag.Bool("DisableTVSupport", false, "Disable the TVShow support and pages")
	videosFullyDeletable := flag.Bool("FullyDeletableVideos", false, "Allow deletion from harddisk")

	flag.Parse()

	settings2.SetTVShowEnabled(!*disableTVShowSupport)
	settings2.SetVideosDeletable(*videosFullyDeletable)

	return &database.DatabaseConfig{
		DBHost:     *dbhostPtr,
		DBPort:     *dbPortPtr,
		DBUser:     *dbUserPtr,
		DBPassword: *dbPassPtr,
		DBName:     *dbNamePtr,
	}, *verbosePtr, pathPrefix
}
