package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api/types"
)

func readVideosFromResultset(rows *sql.Rows) []types.VideoUnloadedType {
	var result []types.VideoUnloadedType
	for rows.Next() {
		var vid types.VideoUnloadedType
		err := rows.Scan(&vid.MovieId, &vid.MovieName)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		result = append(result, vid)
	}
	rows.Close()

	return result
}

// TagID - TagName : pay attention to the order!
func readTagsFromResultset(rows *sql.Rows) []types.Tag {
	// initialize with empty array!
	result := []types.Tag{}
	for rows.Next() {
		var tag types.Tag
		err := rows.Scan(&tag.TagId, &tag.TagName)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		result = append(result, tag)
	}
	rows.Close()

	return result
}

func readActorsFromResultset(rows *sql.Rows) []types.Actor {
	var result []types.Actor
	for rows.Next() {
		var actor types.Actor
		var thumbnail []byte

		err := rows.Scan(&actor.ActorId, &actor.Name, &thumbnail)
		fmt.Println(len(thumbnail))
		if len(thumbnail) != 0 {
			actor.Thumbnail = string(thumbnail)
		}
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		result = append(result, actor)
	}
	rows.Close()

	return result
}

func jsonify(v interface{}) []byte {
	// jsonify results
	str, err := json.Marshal(v)
	if err != nil {
		fmt.Println("Error while Jsonifying return object: " + err.Error())
	}
	return str
}
