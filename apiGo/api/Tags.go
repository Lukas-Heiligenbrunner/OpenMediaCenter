package api

import (
	"fmt"
	"openmediacenter/apiGo/database"
	"regexp"
)

func AddTagHandlers() {
	getFromDB()
	addToDB()
	deleteFromDB()
}

func deleteFromDB() {
	var dT struct {
		TagId int
		Force bool
	}
	AddHandler("deleteTag", TagNode, &dT, func() []byte {
		// delete key constraints first
		if dT.Force {
			query := fmt.Sprintf("DELETE FROM video_tags WHERE tag_id=%d", dT.TagId)
			err := database.Edit(query)

			// respond only if result not successful
			if err != nil {
				return database.ManualSuccessResponse(err)
			}
		}

		query := fmt.Sprintf("DELETE FROM tags WHERE tag_id=%d", dT.TagId)
		err := database.Edit(query)

		if err == nil {
			// return if successful
			return database.ManualSuccessResponse(err)
		} else {
			// check with regex if its the key constraint error
			r, _ := regexp.Compile("^.*a foreign key constraint fails.*$")
			if r.MatchString(err.Error()) {
				return []byte(`{"result":"not empty tag"}`)
			} else {
				return database.ManualSuccessResponse(err)
			}
		}
	})
}

func getFromDB() {
	AddHandler("getAllTags", TagNode, nil, func() []byte {
		query := "SELECT tag_id,tag_name from tags"
		return jsonify(readTagsFromResultset(database.Query(query)))
	})
}

func addToDB() {
	var ct struct {
		TagName string
	}
	AddHandler("createTag", TagNode, &ct, func() []byte {
		query := "INSERT IGNORE INTO tags (tag_name) VALUES (?)"
		return database.SuccessQuery(query, ct.TagName)
	})

	var at struct {
		MovieId int
		TagId   int
	}
	AddHandler("addTag", TagNode, &at, func() []byte {
		query := "INSERT IGNORE INTO video_tags(tag_id, video_id) VALUES (?,?)"
		return database.SuccessQuery(query, at.TagId, at.MovieId)
	})
}
