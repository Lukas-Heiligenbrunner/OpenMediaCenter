package main

import (
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api"
	"openmediacenter/apiGo/database"
	"os"
)

func main() {
	fmt.Println("init OpenMediaCenter server")

	database.InitDB()
	defer database.Close()

	type name struct {
		Action string
		Tag    int
	}

	var testiii name
	api.AddHandler("getMovies", &testiii, func() []byte {
		fmt.Println(testiii.Action)
		fmt.Println(testiii.Tag)

		rows := database.Query("SELECT * FROM videos")

		for rows.Next() {

		}

		type VideoUnloadedType struct {
			Movie_id   int
			Movie_name string
		}

		type ArrVideo []VideoUnloadedType

		var arr = ArrVideo{
			VideoUnloadedType{1, "TestVideo"},
			VideoUnloadedType{2, "SecVideo"},
		}

		str, _ := json.Marshal(arr)
		fmt.Fprintf(os.Stdout, "%s", str)
		return str
	})

	api.ServerInit()
}
