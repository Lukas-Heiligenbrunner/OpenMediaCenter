package api

import (
	"fmt"
	gws "github.com/gowebsecure/goWebSecure-go"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
)

func AddActorsHandlers() {
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
	gws.AddHandler("getAllActors", ActorNode, func(info *gws.HandlerInfo) []byte {
		query := "SELECT actor_id, name, thumbnail FROM actors"
		return jsonify(readActorsFromResultset(database.Query(query)))
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
	gws.AddHandler("getActorsOfVideo", ActorNode, func(info *gws.HandlerInfo) []byte {
		var args struct {
			MovieId int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf(`SELECT a.actor_id, name, thumbnail FROM actors_videos
									JOIN actors a on actors_videos.actor_id = a.actor_id
									WHERE actors_videos.video_id=%d`, args.MovieId)

		return jsonify(readActorsFromResultset(database.Query(query)))
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
	gws.AddHandler("getActorInfo", ActorNode, func(info *gws.HandlerInfo) []byte {
		var args struct {
			ActorId int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
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

		return jsonify(result)
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
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	gws.AddHandler("createActor", ActorNode, func(info *gws.HandlerInfo) []byte {
		var args struct {
			ActorName string
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := "INSERT IGNORE INTO actors (name) VALUES (?)"
		return database.SuccessQuery(query, args.ActorName)
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
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	gws.AddHandler("addActorToVideo", ActorNode, func(info *gws.HandlerInfo) []byte {
		var args struct {
			ActorId int
			MovieId int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf("INSERT IGNORE INTO actors_videos (actor_id, video_id) VALUES (%d,%d)", args.ActorId, args.MovieId)
		return database.SuccessQuery(query)
	})
}
