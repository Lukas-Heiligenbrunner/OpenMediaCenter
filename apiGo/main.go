package main

import (
	"flag"
	"fmt"
	"openmediacenter/apiGo/api"
	"openmediacenter/apiGo/database"
)

func main() {
	fmt.Println("init OpenMediaCenter server")

	db, verbose := handleCommandLineArguments()
	// todo some verbosity logger or sth

	fmt.Printf("Use verbose output: %t\n", verbose)

	database.InitDB(db)
	defer database.Close()

	api.AddVideoHandlers()
	api.AddSettingsHandlers()
	api.AddTagHandlers()
	api.AddActorsHandlers()

	api.ServerInit(8081)
}

func handleCommandLineArguments() (*database.DatabaseConfig, bool) {
	dbhostPtr := flag.String("DBHost", "127.0.0.1", "database host name")
	dbPortPtr := flag.Int("DBPort", 3306, "database port")
	dbUserPtr := flag.String("DBUser", "mediacenteruser", "database username")
	dbPassPtr := flag.String("DBPassword", "mediapassword", "database username")
	dbNamePtr := flag.String("DBName", "mediacenter", "database name")

	verbosePtr := flag.Bool("v", true, "Verbose log output")

	//pathPrefix := flag.String("ReindexPrefix", "/var/www/openmediacenter", "Prefix path for videos to reindex")

	flag.Parse()

	return &database.DatabaseConfig{
		DBHost:     *dbhostPtr,
		DBPort:     *dbPortPtr,
		DBUser:     *dbUserPtr,
		DBPassword: *dbPassPtr,
		DBName:     *dbNamePtr,
	}, *verbosePtr
}
