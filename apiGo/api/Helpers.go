package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api/types"
	"reflect"
)

// MovieId - MovieName : pay attention to the order!
func readVideosFromResultset(rows *sql.Rows) []types.VideoUnloadedType {
	result := []types.VideoUnloadedType{}
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

// ActorId - ActorName - Thumbnail : pay attention to the order!
func readActorsFromResultset(rows *sql.Rows) []types.Actor {
	var result []types.Actor
	for rows.Next() {
		var actor types.Actor
		var thumbnail []byte

		err := rows.Scan(&actor.ActorId, &actor.Name, &thumbnail)
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

// ID - Name : pay attention to the order!
func readTVshowsFromResultset(rows *sql.Rows) []types.TVShow {
	result := []types.TVShow{}
	for rows.Next() {
		var vid types.TVShow
		err := rows.Scan(&vid.Id, &vid.Name)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
		}
		result = append(result, vid)
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

// setField set a specific field of an object with an object provided
func setField(obj interface{}, name string, value interface{}) error {
	structValue := reflect.ValueOf(obj).Elem()
	structFieldValue := structValue.FieldByName(name)

	if !structFieldValue.IsValid() {
		return fmt.Errorf("no such field: %s in obj", name)
	}

	if !structFieldValue.CanSet() {
		return fmt.Errorf("cannot set %s field value", name)
	}

	structFieldType := structFieldValue.Type()
	val := reflect.ValueOf(value)

	if structFieldType != val.Type() {
		if val.Type().ConvertibleTo(structFieldType) {
			// if type is convertible - convert and set
			structFieldValue.Set(val.Convert(structFieldType))
		} else {
			return fmt.Errorf("provided value %s type didn't match obj field type and isn't convertible", name)
		}
	} else {
		// set value if type is the same
		structFieldValue.Set(val)
	}

	return nil
}

// FillStruct fill a custom struct with objects of a map
func FillStruct(i interface{}, m map[string]interface{}) error {
	for k, v := range m {
		err := setField(i, k, v)
		if err != nil {
			return err
		}
	}
	return nil
}
