package database

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func InitDB() {
	// Open up our database connection.
	// I've set up a database on my local machine using phpmyadmin.
	// The database is called testDb
	var err error
	db, err = sql.Open("mysql", "root:1qayxsw2@tcp(192.168.0.30:3306)/hub")

	// if there is an error opening the connection, handle it
	if err != nil {
		fmt.Println("failed to connect...")
		panic(err.Error())
	}
}

func Query(SQL string) *sql.Rows {
	// perform a db.Query insert
	query, err := db.Query(SQL)

	// if there is an error inserting, handle it
	if err != nil {
		panic(err.Error())
	}
	// be careful deferring Queries if you are using transactions

	return query
}

func Close() {
	db.Close()
}
