package api

import (
	"fmt"
	gws "github.com/gowebsecure/goWebSecure-go"
	"openmediacenter/apiGo/database"
	"regexp"
)

func AddTagHandlers() {
	getFromDB()
	addToDB()
	deleteFromDB()
}

func deleteFromDB() {
	/**
	 * @api {post} /api/tags [deleteTag]
	 * @apiDescription Start Database video reindex Job
	 * @apiName deleteTag
	 * @apiGroup Tags
	 *
	 * @apiParam {bool} [Force] force delete tag with its constraints
	 * @apiParam {int} TagId id of tag to delete
	 *
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	gws.AddHandler("deleteTag", TagNode, func(info *gws.HandlerInfo) []byte {
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
				return database.ManualSuccessResponse(fmt.Errorf("not empty tag"))
			} else {
				return database.ManualSuccessResponse(err)
			}
		}
	})
}

func getFromDB() {
	/**
	 * @api {post} /api/tags [getAllTags]
	 * @apiDescription get all available Tags
	 * @apiName getAllTags
	 * @apiGroup Tags
	 *
	 * @apiSuccess {Object[]} array of tag objects
	 * @apiSuccess {uint32} TagId
	 * @apiSuccess {string} TagName name of the Tag
	 */
	gws.AddHandler("getAllTags", TagNode, func(info *gws.HandlerInfo) []byte {
		query := "SELECT tag_id,tag_name from tags"
		return jsonify(readTagsFromResultset(database.Query(query)))
	})
}

func addToDB() {
	/**
	 * @api {post} /api/tags [createTag]
	 * @apiDescription create a new tag
	 * @apiName createTag
	 * @apiGroup Tags
	 *
	 * @apiParam {string} TagName name of the tag
	 *
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	gws.AddHandler("createTag", TagNode, func(info *gws.HandlerInfo) []byte {
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

	/**
	 * @api {post} /api/tags [addTag]
	 * @apiDescription Add new tag to video
	 * @apiName addTag
	 * @apiGroup Tags
	 *
	 * @apiParam {int} TagId Tag id to add to video
	 * @apiParam {int} MovieId Video Id of video to add tag to
	 *
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	gws.AddHandler("addTag", TagNode, func(info *gws.HandlerInfo) []byte {
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
