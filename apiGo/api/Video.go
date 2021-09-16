package api

import (
	"fmt"
	"net/url"
	"openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"os"
	"strconv"
)

func AddVideoHandlers() {
	getVideoHandlers()
	loadVideosHandlers()
	addToVideoHandlers()
}

func getVideoHandlers() {
	/**
	 * @api {post} /api/video [getMovies]
	 * @apiDescription Request available Videos
	 * @apiName GetMovies
	 * @apiGroup video
	 *
	 * @apiParam {int} [Tag=1] id of VideoTag to get videos (1=all)
	 *
	 * @apiSuccess {Object[]} Videos List of Videos
	 * @apiSuccess {number} Videos.MovieId Id of Video
	 * @apiSuccess {String} Videos.MovieName  Name of video
	 * @apiSuccess {String} TagName Name of the Tag returned
	 */
	api.AddHandler("getMovies", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			Tag  uint32
			Sort uint8
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Text("unable to decode request")
			return
		}

		const (
			date   = iota
			likes  = iota
			random = iota
			names  = iota
			length = iota
		)

		// if wrong number passed no sorting is performed
		var SortClause = ""
		switch args.Sort {
		case date:
			SortClause = "ORDER BY create_date DESC, movie_name"
			break
		case likes:
			SortClause = "ORDER BY likes DESC"
			break
		case random:
			SortClause = "ORDER BY RAND()"
			break
		case names:
			SortClause = "ORDER BY movie_name"
			break
		case length:
			SortClause = "ORDER BY length DESC"
			break
		}

		var query string
		// 1 is the id of the ALL tag
		if args.Tag != 1 {
			query = fmt.Sprintf(`SELECT movie_id,movie_name,t.tag_name FROM videos
					INNER JOIN video_tags vt on videos.movie_id = vt.video_id
					INNER JOIN tags t on vt.tag_id = t.tag_id
					WHERE t.tag_id = %d %s`, args.Tag, SortClause)
		} else {
			query = fmt.Sprintf("SELECT movie_id,movie_name, (SELECT 'All' as tag_name) FROM videos %s", SortClause)
		}

		var result struct {
			Videos  []types.VideoUnloadedType
			TagName string
		}

		rows := database.Query(query)
		vids := []types.VideoUnloadedType{}
		var name string
		for rows.Next() {
			var vid types.VideoUnloadedType
			err := rows.Scan(&vid.MovieId, &vid.MovieName, &name)
			if err != nil {
				return
			}
			vids = append(vids, vid)
		}
		if rows.Close() != nil {
			return
		}

		// if the tag id doesn't exist the query won't return a name
		if name == "" {
			return
		}

		result.Videos = vids
		result.TagName = name
		context.Json(result)
	})

	/**
	 * @api {post} /api/video [readThumbnail]
	 * @apiDescription Load Thubnail of specific Video
	 * @apiName readThumbnail
	 * @apiGroup video
	 *
	 * @apiParam {int} Movieid id of video to load thumbnail
	 *
	 * @apiSuccess {string} . Base64 encoded Thubnail
	 */
	api.AddHandler("readThumbnail", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			Movieid int
		}
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Text("unable to decode request")
			return
		}

		var pic []byte

		query := fmt.Sprintf("SELECT thumbnail FROM videos WHERE movie_id=%d", args.Movieid)

		err = database.QueryRow(query).Scan(&pic)
		if err != nil {
			fmt.Printf("the thumbnail of movie id %d couldn't be found", args.Movieid)
			return
		}

		context.Text(string(pic))
	})

	/**
	 * @api {post} /api/video [getRandomMovies]
	 * @apiDescription Load random videos
	 * @apiName getRandomMovies
	 * @apiGroup video
	 *
	 * @apiParam {int} Number number of random videos to load
	 *
	 * @apiSuccess {Object[]} Tags Array of tags occuring in selection
	 * @apiSuccess {string} Tags.TagName Tagname
	 * @apiSuccess {uint32} Tags.TagId Tag ID
	 *
	 * @apiSuccess {Object[]} Videos Array of the videos
	 * @apiSuccess {string} Videos.MovieName Video Name
	 * @apiSuccess {int} Videos.MovieId Video ID
	 */
	api.AddHandler("getRandomMovies", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			Number int
		}
		if api.DecodeRequest(context.GetRequest(), &args) != nil {
			context.Text("unable to decode request")
			return
		}

		var result struct {
			Tags   []types.Tag
			Videos []types.VideoUnloadedType
		}

		query := fmt.Sprintf("SELECT movie_id,movie_name FROM videos ORDER BY RAND() LIMIT %d", args.Number)
		result.Videos = readVideosFromResultset(database.Query(query))

		var ids string
		for i := range result.Videos {
			ids += "video_tags.video_id=" + strconv.Itoa(result.Videos[i].MovieId)

			if i < len(result.Videos)-1 {
				ids += " OR "
			}
		}

		// add the corresponding tags
		query = fmt.Sprintf(`SELECT t.tag_name,t.tag_id FROM video_tags
									INNER JOIN tags t on video_tags.tag_id = t.tag_id
									WHERE %s
									GROUP BY t.tag_id`, ids)

		rows := database.Query(query)

		for rows.Next() {
			var tag types.Tag
			err := rows.Scan(&tag.TagName, &tag.TagId)
			if err != nil {
				panic(err.Error()) // proper Error handling instead of panic in your app
			}
			// append to final array
			result.Tags = append(result.Tags, tag)
		}

		context.Json(result)
	})

	/**
	 * @api {post} /api/video [getSearchKeyWord]
	 * @apiDescription Get videos for search keyword
	 * @apiName getSearchKeyWord
	 * @apiGroup video
	 *
	 * @apiParam {string} KeyWord Keyword to search for
	 *
	 * @apiSuccess {Object[]} . List of Videos
	 * @apiSuccess {number} .MovieId Id of Video
	 * @apiSuccess {String} .MovieName  Name of video
	 */
	api.AddHandler("getSearchKeyWord", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			KeyWord string
		}
		if api.DecodeRequest(context.GetRequest(), &args) != nil {
			context.Text("unable to decode request")
			return
		}

		query := fmt.Sprintf(`SELECT movie_id,movie_name FROM videos 
					WHERE movie_name LIKE '%%%s%%'
					ORDER BY likes DESC, create_date DESC, movie_name`, args.KeyWord)
		context.Json(readVideosFromResultset(database.Query(query)))
	})
}

// function to handle stuff for loading specific videos and startdata
func loadVideosHandlers() {
	/**
	 * @api {post} /api/video [loadVideo]
	 * @apiDescription Load all data for a specific video
	 * @apiName loadVideo
	 * @apiGroup video
	 *
	 * @apiParam {int} MovieId ID of video
	 *
	 * @apiSuccess {string} MovieName Videoname
	 * @apiSuccess {uint32} MovieId Video ID
	 * @apiSuccess {string} MovieUrl Url to video file
	 * @apiSuccess {string} Poster Base64 encoded Poster
	 * @apiSuccess {uint64} Likes Number of likes
	 * @apiSuccess {uint16} Quality Video FrameWidth
	 * @apiSuccess {uint16} Length Video Length in seconds
	 *
	 *
	 * @apiSuccess {Object[]} Tags Array of tags of video
	 * @apiSuccess {string} Tags.TagName Tagname
	 * @apiSuccess {uint32} Tags.TagId Tag ID
	 *
	 * @apiSuccess {Object[]} SuggestedTag Array of tags for quick add suggestions
	 * @apiSuccess {string} SuggestedTag.TagName Tagname
	 * @apiSuccess {uint32} SuggestedTag.TagId Tag ID
	 *
	 * @apiSuccess {Object[]} Actors Array of Actors playing in this video
	 * @apiSuccess {uint32} Actors.ActorId Actor Id
	 * @apiSuccess {string} Actors.Name Actor Name
	 * @apiSuccess {string} Actors.Thumbnail Portrait Thumbnail
	 */
	api.AddHandler("loadVideo", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			MovieId int
		}
		if api.DecodeRequest(context.GetRequest(), &args) != nil {
			context.Text("unable to decode request")
			return
		}

		query := fmt.Sprintf(`SELECT movie_name,movie_url,movie_id,thumbnail,poster,likes,quality,length 
										FROM videos WHERE movie_id=%d`, args.MovieId)

		var res types.FullVideoType
		var poster []byte
		var thumbnail []byte

		err := database.QueryRow(query).Scan(&res.MovieName, &res.MovieUrl, &res.MovieId, &thumbnail, &poster, &res.Likes, &res.Quality, &res.Length)
		if err != nil {
			fmt.Printf("Error getting full data list of videoid - %d", args.MovieId)
			fmt.Println(err.Error())
			return
		}

		// we ned to urlencode the movieurl
		res.MovieUrl = url.PathEscape(res.MovieUrl)

		// we need to stringify the pic byte array
		res.Poster = string(poster)

		// if poster in db is empty we use the thumbnail
		if res.Poster == "" {
			res.Poster = string(thumbnail)
		}

		// now add the tags of this video
		query = fmt.Sprintf(`SELECT t.tag_id, t.tag_name FROM video_tags 
					INNER JOIN tags t on video_tags.tag_id = t.tag_id
					WHERE video_tags.video_id=%d
					GROUP BY t.tag_id`, args.MovieId)

		res.Tags = readTagsFromResultset(database.Query(query))

		query = fmt.Sprintf(`SELECT * FROM tags
					WHERE tag_id NOT IN (
						SELECT video_tags.tag_id FROM video_tags
					WHERE video_id=%d)
					ORDER BY rand()
					LIMIT 5`, args.MovieId)

		res.SuggestedTag = readTagsFromResultset(database.Query(query))

		// query the actors corresponding to video
		query = fmt.Sprintf(`SELECT a.actor_id, name, thumbnail FROM actors_videos
					JOIN actors a on actors_videos.actor_id = a.actor_id
					WHERE actors_videos.video_id=%d`, args.MovieId)

		res.Actors = readActorsFromResultset(database.Query(query))

		context.Json(res)
	})

	/**
	 * @api {post} /api/video [getStartData]
	 * @apiDescription Get general video informations at start
	 * @apiName getStartData
	 * @apiGroup video
	 *
	 * @apiSuccess {uint32} VideoNr Total nr of videos
	 * @apiSuccess {uint32} FullHdNr number of FullHD videos
	 * @apiSuccess {uint32} HDNr number of HD videos
	 * @apiSuccess {uint32} SDNr number of SD videos
	 * @apiSuccess {uint32} DifferentTags number of different Tags available
	 * @apiSuccess {uint32} Tagged number of different Tags assigned
	 */
	api.AddHandler("getStartData", api.VideoNode, api.PermUser, func(context api.Context) {
		var result types.StartData
		// query settings and infotile values
		query := `
					SELECT (
						SELECT COUNT(*) FROM videos
					) AS videonr,
					(
						SELECT COUNT(*) FROM videos
                        INNER JOIN video_tags vt on videos.movie_id = vt.video_id
                        INNER JOIN tags t on vt.tag_id = t.tag_id
					) AS tagged,
					(
						SELECT COUNT(*) FROM video_tags as vt
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='hd'
					) AS hd,
					(
						SELECT COUNT(*) FROM video_tags as vt
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='fullhd'
					) AS fullhd,
					(
						SELECT COUNT(*) FROM video_tags as vt
                        INNER JOIN tags t on vt.tag_id = t.tag_id
                        WHERE t.tag_name='lowquality'
					) AS lq,
					(
						SELECT COUNT(*) as nr FROM tags
					) as tags 
					LIMIT 1`

		_ = database.QueryRow(query).Scan(&result.VideoNr, &result.Tagged, &result.HDNr, &result.FullHdNr, &result.SDNr, &result.DifferentTags)

		context.Json(result)
	})
}

func addToVideoHandlers() {
	/**
	 * @api {post} /api/video [addLike]
	 * @apiDescription Add a like to a video
	 * @apiName addLike
	 * @apiGroup video
	 *
	 * @apiParam {int} MovieId ID of video
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("addLike", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			MovieId int
		}
		if api.DecodeRequest(context.GetRequest(), &args) != nil {
			context.Text("unable to decode request")
			return
		}

		query := fmt.Sprintf("update videos set likes = likes + 1 where movie_id = %d", args.MovieId)
		context.Text(string(database.SuccessQuery(query)))
	})

	/**
	 * @api {post} /api/video [deleteVideo]
	 * @apiDescription Delete a specific video from database
	 * @apiName deleteVideo
	 * @apiGroup video
	 *
	 * @apiParam {int} MovieId ID of video
	 * @apiParam {bool} FullyDelete Delete video from disk?
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("deleteVideo", api.VideoNode, api.PermUser, func(context api.Context) {
		var args struct {
			MovieId     int
			FullyDelete bool
		}
		if api.DecodeRequest(context.GetRequest(), &args) != nil {
			context.Text("unable to decode request")
			return
		}

		// delete tag constraints
		query := fmt.Sprintf("DELETE FROM video_tags WHERE video_id=%d", args.MovieId)
		err := database.Edit(query)

		// delete actor constraints
		query = fmt.Sprintf("DELETE FROM actors_videos WHERE video_id=%d", args.MovieId)
		err = database.Edit(query)

		// respond only if result not successful
		if err != nil {
			context.Text(string(database.ManualSuccessResponse(err)))
		}

		// only allow deletion of video if cli flag is set, independent of passed api arg
		if config.GetConfig().Features.FullyDeletableVideos && args.FullyDelete {
			// get physical path of video to delete
			query = fmt.Sprintf("SELECT movie_url FROM videos WHERE movie_id=%d", args.MovieId)
			var vidpath string
			err := database.QueryRow(query).Scan(&vidpath)
			if err != nil {
				context.Text(string(database.ManualSuccessResponse(err)))
			}

			sett, videoprefix, _ := database.GetSettings()
			assembledPath := videoprefix + sett.VideoPath + vidpath

			err = os.Remove(assembledPath)
			if err != nil {
				fmt.Printf("unable to delete file: %s -- %s\n", assembledPath, err.Error())
				context.Text(string(database.ManualSuccessResponse(err)))
			}
		}

		// delete video row from db
		query = fmt.Sprintf("DELETE FROM videos WHERE movie_id=%d", args.MovieId)
		context.Text(string(database.SuccessQuery(query)))
	})
}
