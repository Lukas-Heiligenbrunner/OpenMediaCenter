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
	AddHandler("deleteTag", TagNode, func(info *HandlerInfo) []byte {
		var args struct {
			TagId int
			Force bool
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		// delete key constraints first
		if args.Force {
			query := fmt.Sprintf("DELETE FROM video_tags WHERE tag_id=%d", args.TagId)
			err := database.Edit(query)

			// respond only if result not successful
			if err != nil {
				return database.ManualSuccessResponse(err)
			}
		}

		query := fmt.Sprintf("DELETE FROM tags WHERE tag_id=%d", args.TagId)
		err := database.Edit(query)

		if err == nil {
			// return if successful
			return database.ManualSuccessResponse(err)
		} else {
			// check with regex if its the key constraint error
			r := regexp.MustCompile("^.*a foreign key constraint fails.*$")
			if r.MatchString(err.Error()) {
				return []byte(`{"result":"not empty tag"}`)
			} else {
				return database.ManualSuccessResponse(err)
			}
		}
	})
}

func getFromDB() {
	AddHandler("getAllTags", TagNode, func(info *HandlerInfo) []byte {
		query := "SELECT tag_id,tag_name from tags"
		return jsonify(readTagsFromResultset(database.Query(query)))
	})
}

func addToDB() {
	AddHandler("createTag", TagNode, func(info *HandlerInfo) []byte {
		var args struct {
			TagName string
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := "INSERT IGNORE INTO tags (tag_name) VALUES (?)"
		return database.SuccessQuery(query, args.TagName)
	})

	AddHandler("addTag", TagNode, func(info *HandlerInfo) []byte {
		var args struct {
			MovieId int
			TagId   int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := "INSERT IGNORE INTO video_tags(tag_id, video_id) VALUES (?,?)"
		return database.SuccessQuery(query, args.TagId, args.MovieId)
	})
}
