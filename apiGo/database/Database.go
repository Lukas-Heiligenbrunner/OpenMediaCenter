package database

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"openmediacenter/apiGo/api/types"
)

var db *sql.DB
var DBName string

// store the command line parameter for Videoprefix
var SettingsVideoPrefix = ""

type DatabaseConfig struct {
	DBHost     string
	DBPort     int
	DBUser     string
	DBPassword string
	DBName     string
}

func InitDB(dbconf *DatabaseConfig) {
	DBName = dbconf.DBName

	// Open up our database connection.
	var err error
	db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", dbconf.DBUser, dbconf.DBPassword, dbconf.DBHost, dbconf.DBPort, dbconf.DBName))

	// if there is an error opening the connection, handle it
	if err != nil {
		fmt.Printf("Error while connecting to database! - %s\n", err.Error())
	}

	if db != nil {
		ping := db.Ping()
		if ping != nil {
			fmt.Printf("Error while connecting to database! - %s\n", ping.Error())
		}
	}
}

func Query(query string, args ...interface{}) *sql.Rows {
	// perform a db.Query insert
	res, err := db.Query(query, args...)

	// if there is an error inserting, handle it
	if err != nil {
		fmt.Printf("Error while requesting data! - %s\n", err.Error())
	}

	return res
}

func QueryRow(SQL string, args ...interface{}) *sql.Row {
	return db.QueryRow(SQL, args...)
}

func Edit(query string, args ...interface{}) error {
	_, err := db.Exec(query, args...)
	return err
}

func SuccessQuery(query string, args ...interface{}) []byte {
	return ManualSuccessResponse(Edit(query, args...))
}

func ManualSuccessResponse(err error) []byte {
	if err == nil {
		return []byte(`{"result":"success"}`)
	} else {
		return []byte(fmt.Sprintf(`{"result":"%s"}`, err.Error()))
	}
}

func Close() {
	db.Close()
}

func GetSettings() types.SettingsType {
	var result types.SettingsType

	// query settings and infotile values
	query := fmt.Sprintf(`
                SELECT (
                           SELECT COUNT(*)
                           FROM videos
                       ) AS videonr,
                       (
                           SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS Size
                           FROM information_schema.TABLES
                           WHERE TABLE_SCHEMA = '%s'
                           GROUP BY table_schema
                       ) AS dbsize,
                       (
                           SELECT COUNT(*)
                           FROM tags
                       ) AS difftagnr,
                       (
                           SELECT COUNT(*)
                           FROM video_tags
                       ) AS tagsadded,
                       video_path, episode_path, password, mediacenter_name, TMDB_grabbing, DarkMode
                FROM settings
                LIMIT 1`, DBName)

	var DarkMode int
	var TMDBGrabbing int

	err := QueryRow(query).Scan(&result.VideoNr, &result.DBSize, &result.DifferentTags, &result.TagsAdded,
		&result.VideoPath, &result.EpisodePath, &result.Password, &result.MediacenterName, &TMDBGrabbing, &DarkMode)

	if err != nil {
		fmt.Println(err.Error())
	}

	result.TMDBGrabbing = TMDBGrabbing != 0
	result.PasswordEnabled = result.Password != "-1"
	result.DarkMode = DarkMode != 0
	result.PathPrefix = SettingsVideoPrefix

	return result
}
