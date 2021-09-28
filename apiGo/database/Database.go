package database

import (
	"database/sql"
	"embed"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/pressly/goose/v3"
	"log"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/config"
	"os"
)

var db *sql.DB
var DBName string

//go:embed migrations/*.sql
var embedMigrations embed.FS

func InitDB() error {
	dbconf := config.GetConfig().Database
	DBName = dbconf.DBName

	// Open up our database connection.
	var err error
	db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", dbconf.DBUser, dbconf.DBPassword, dbconf.DBHost, dbconf.DBPort, dbconf.DBName))

	// if there is an error opening the connection, handle it
	if err != nil {
		return fmt.Errorf("Error while connecting to database! - %s\n", err.Error())
	}

	if db != nil {
		ping := db.Ping()
		if ping != nil {
			return fmt.Errorf("Error while connecting to database! - %s\n", ping.Error())
		}
	}

	fmt.Println("Running Database migrations!")
	// perform database migrations
	goose.SetBaseFS(embedMigrations)
	goose.SetLogger(log.New(os.Stdout, "", 0))

	// set mysql dialect
	err = goose.SetDialect("mysql")
	if err != nil {
		return err
	}

	if err := goose.Up(db, "migrations"); err != nil {
		return err
	}

	return nil
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

// edit something in the DB  and give only an error response
func Edit(query string, args ...interface{}) error {
	_, err := db.Exec(query, args...)
	return err
}

// insert/edit a query and return last insert id
func Insert(query string, args ...interface{}) (error, int64) {
	resp, err := db.Exec(query, args...)
	var id int64 = 0
	if err == nil {
		id, err = resp.LastInsertId()
	}

	return err, id
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

func GetSettings() (result types.SettingsType, PathPrefix string, sizes types.SettingsSizeType) {
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

	err := QueryRow(query).Scan(&sizes.VideoNr, &sizes.DBSize, &sizes.DifferentTags, &sizes.TagsAdded,
		&result.VideoPath, &result.EpisodePath, &result.Password, &result.MediacenterName, &TMDBGrabbing, &DarkMode)

	if err != nil {
		fmt.Println(err.Error())
	}

	result.TMDBGrabbing = TMDBGrabbing != 0
	result.PasswordEnabled = result.Password != "-1"
	result.DarkMode = DarkMode != 0
	PathPrefix = config.GetConfig().General.ReindexPrefix
	return
}
