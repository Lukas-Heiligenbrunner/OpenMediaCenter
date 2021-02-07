package database

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

const (
	DBUser     = "root"
	DBPassword = "1qayxsw2"
	DBHost     = "192.168.0.30"
	DBPort     = 3306
	DBName     = "hub"
)

func InitDB() {
	// Open up our database connection.
	// I've set up a database on my local machine using phpmyadmin.
	// The database is called testDb
	var err error
	db, err = sql.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:%d)/%s", DBUser, DBPassword, DBHost, DBPort, DBName))

	// if there is an error opening the connection, handle it
	if err != nil {
		fmt.Println("failed to connect...")
		panic(err.Error())
	}
}

func Query(query string, args ...interface{}) *sql.Rows {
	// perform a db.Query insert
	res, err := db.Query(query, args...)

	// if there is an error inserting, handle it
	if err != nil {
		panic(err.Error())
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

func GetDBName() string {
	return DBName
}
