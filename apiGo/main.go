package main

import (
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api"
	"os"
)

func main() {
	fmt.Println("init OpenMediaCenter server")

	type name struct {
		Action string
		Tag    int
	}

	var testiii name
	api.AddHandler("getMovies", &testiii, func() []byte {
		fmt.Println(testiii.Action)
		fmt.Println(testiii.Tag)

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
