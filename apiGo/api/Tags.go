package api

import (
	"fmt"
	"openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/database"
	"regexp"
)

func addTagHandlers() {
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
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("deleteTag", api.TagNode, api.PermUser, func(context api.Context) {
		var args struct {
			TagId int
			Force bool
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Text("unable to decode request")
			return
		}

		// delete key constraints first
		if args.Force {
			query := fmt.Sprintf("DELETE FROM video_tags WHERE tag_id=%d", args.TagId)
			err := database.Edit(query)

			// respond only if result not successful
			if err != nil {
				context.Text(string(database.ManualSuccessResponse(err)))
				return
			}
		}

		query := fmt.Sprintf("DELETE FROM tags WHERE tag_id=%d", args.TagId)
		err = database.Edit(query)

		if err == nil {
			// return if successful
			context.Text(string(database.ManualSuccessResponse(err)))
		} else {
			// check with regex if its the key constraint Error
			r := regexp.MustCompile("^.*a foreign key constraint fails.*$")
			if r.MatchString(err.Error()) {
				context.Text(string(database.ManualSuccessResponse(fmt.Errorf("not empty tag"))))
			} else {
				context.Text(string(database.ManualSuccessResponse(err)))
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
	api.AddHandler("getAllTags", api.TagNode, api.PermUser, func(context api.Context) {
		query := "SELECT tag_id,tag_name from tags ORDER BY tag_name ASC"
		context.Json(readTagsFromResultset(database.Query(query)))
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
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("createTag", api.TagNode, api.PermUser, func(context api.Context) {
		var args struct {
			TagName string
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Text("unable to decode request")
			return
		}

		query := "INSERT IGNORE INTO tags (tag_name) VALUES (?)"
		context.Text(string(database.SuccessQuery(query, args.TagName)))
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
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("addTag", api.TagNode, api.PermUser, func(context api.Context) {
		var args struct {
			MovieId int
			TagId   int
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Text("unable to decode request")
			return
		}

		query := "INSERT IGNORE INTO video_tags(tag_id, video_id) VALUES (?,?)"
		context.Text(string(database.SuccessQuery(query, args.TagId, args.MovieId)))
	})
}
