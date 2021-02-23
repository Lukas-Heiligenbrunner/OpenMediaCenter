package api

import (
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
)

func AddActorsHandlers() {
	saveActorsToDB()
	getActorsFromDB()
}

func getActorsFromDB() {
	AddHandler("getAllActors", ActorNode, nil, func() []byte {
		query := "SELECT actor_id, name, thumbnail FROM actors"
		return jsonify(readActorsFromResultset(database.Query(query)))
	})

	var gaov struct {
		MovieId int
	}
	AddHandler("getActorsOfVideo", ActorNode, &gaov, func() []byte {
		query := fmt.Sprintf(`SELECT a.actor_id, name, thumbnail FROM actors_videos
									JOIN actors a on actors_videos.actor_id = a.actor_id
									WHERE actors_videos.video_id=%d`, gaov.MovieId)

		return jsonify(readActorsFromResultset(database.Query(query)))
	})

	var gai struct {
		ActorId int
	}
	AddHandler("getActorInfo", ActorNode, &gai, func() []byte {
		query := fmt.Sprintf(`SELECT movie_id, movie_name FROM actors_videos
										JOIN videos v on v.movie_id = actors_videos.video_id
										WHERE actors_videos.actor_id=%d`, gai.ActorId)
		videos := readVideosFromResultset(database.Query(query))

		query = fmt.Sprintf("SELECT actor_id, name, thumbnail FROM actors WHERE actor_id=%d", gai.ActorId)
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
	var ca struct {
		ActorName string
	}
	AddHandler("createActor", ActorNode, &ca, func() []byte {
		query := "INSERT IGNORE INTO actors (name) VALUES (?)"
		return database.SuccessQuery(query, ca.ActorName)
	})

	var aatv struct {
		ActorId int
		MovieId int
	}
	AddHandler("addActorToVideo", ActorNode, &aatv, func() []byte {
		query := fmt.Sprintf("INSERT IGNORE INTO actors_videos (actor_id, video_id) VALUES (%d,%d)", aatv.ActorId, aatv.MovieId)
		return database.SuccessQuery(query)
	})
}
