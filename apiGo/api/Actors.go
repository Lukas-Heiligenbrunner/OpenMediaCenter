package api

import (
	"fmt"
	"openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
)

func addActorsHandlers() {
	saveActorsToDB()
	getActorsFromDB()
}

func getActorsFromDB() {
	/**
	 * @api {post} /api/actor [getAllActors]
	 * @apiDescription Get all available Actors
	 * @apiName getAllActors
	 * @apiGroup Actor
	 *
	 * @apiSuccess {Object[]} . Array of Actors available
	 * @apiSuccess {uint32} .ActorId Actor Id
	 * @apiSuccess {string} .Name Actor Name
	 * @apiSuccess {string} .Thumbnail Portrait Thumbnail
	 */
	api.AddHandler("getAllActors", api.ActorNode, api.PermUser, func(context api.Context) {
		query := "SELECT actor_id, name, thumbnail FROM actors"
		context.Json(readActorsFromResultset(database.Query(query)))
	})

	/**
	 * @api {post} /api/actor [getActorsOfVideo]
	 * @apiDescription Get all actors playing in one video
	 * @apiName getActorsOfVideo
	 * @apiGroup Actor
	 *
	 * @apiParam {int} MovieId ID of video
	 *
	 * @apiSuccess {Object[]} . Array of Actors available
	 * @apiSuccess {uint32} .ActorId Actor Id
	 * @apiSuccess {string} .Name Actor Name
	 * @apiSuccess {string} .Thumbnail Portrait Thumbnail
	 */
	api.AddHandler("getActorsOfVideo", api.ActorNode, api.PermUser, func(context api.Context) {
		var args struct {
			MovieId int
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Text("failed to decode request")
			return
		}

		query := fmt.Sprintf(`SELECT a.actor_id, name, thumbnail FROM actors_videos
									JOIN actors a on actors_videos.actor_id = a.actor_id
									WHERE actors_videos.video_id=%d`, args.MovieId)

		context.Json(readActorsFromResultset(database.Query(query)))
	})

	/**
	 * @api {post} /api/actor [getActorInfo]
	 * @apiDescription Get all infos for an actor
	 * @apiName getActorInfo
	 * @apiGroup Actor
	 *
	 * @apiParam {int} ActorId ID of Actor
	 *
	 * @apiSuccess {VideoUnloadedType[]} Videos Array of Videos this actor plays in
	 * @apiSuccess {uint32} Videos.MovieId Video Id
	 * @apiSuccess {string} Videos.MovieName Video Name
	 *
	 * @apiSuccess {Info} Info Infos about the actor
	 * @apiSuccess {uint32} Info.ActorId Actor Id
	 * @apiSuccess {string} Info.Name Actor Name
	 * @apiSuccess {string} Info.Thumbnail Actor Thumbnail
	 */
	api.AddHandler("getActorInfo", api.ActorNode, api.PermUser, func(context api.Context) {
		var args struct {
			ActorId int
		}

		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Error("unable to decode request")
			return
		}

		query := fmt.Sprintf(`SELECT movie_id, movie_name FROM actors_videos
										JOIN videos v on v.movie_id = actors_videos.video_id
										WHERE actors_videos.actor_id=%d`, args.ActorId)
		videos := readVideosFromResultset(database.Query(query))

		query = fmt.Sprintf("SELECT actor_id, name, thumbnail FROM actors WHERE actor_id=%d", args.ActorId)
		actor := readActorsFromResultset(database.Query(query))[0]

		var result = struct {
			Videos []types.VideoUnloadedType
			Info   types.Actor
		}{
			Videos: videos,
			Info:   actor,
		}

		context.Json(result)
	})
}

func saveActorsToDB() {
	/**
	 * @api {post} /api/video [createActor]
	 * @apiDescription Create a new Actor
	 * @apiName createActor
	 * @apiGroup Actor
	 *
	 * @apiParam {string} ActorName Name of new Actor
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("createActor", api.ActorNode, api.PermUser, func(context api.Context) {
		var args struct {
			ActorName string
		}
		api.DecodeRequest(context.GetRequest(), &args)

		query := "INSERT IGNORE INTO actors (name) VALUES (?)"
		// todo bit ugly
		context.Text(string(database.SuccessQuery(query, args.ActorName)))
	})

	/**
	 * @api {post} /api/video [addActorToVideo]
	 * @apiDescription Add Actor to Video
	 * @apiName addActorToVideo
	 * @apiGroup Actor
	 *
	 * @apiParam {int} ActorId Id of Actor
	 * @apiParam {int} MovieId Id of Movie to add to
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("addActorToVideo", api.ActorNode, api.PermUser, func(context api.Context) {
		var args struct {
			ActorId int
			MovieId int
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Error("unable to decode request")
			return
		}

		query := fmt.Sprintf("INSERT IGNORE INTO actors_videos (actor_id, video_id) VALUES (%d,%d)", args.ActorId, args.MovieId)
		context.Text(string(database.SuccessQuery(query)))
	})
}
