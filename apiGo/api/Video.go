package api

import (
	"encoding/json"
	"fmt"
	"net/url"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/database/settings"
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
	AddHandler("getMovies", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			Tag  uint32
			Sort uint8
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
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
				return nil
			}
			vids = append(vids, vid)
		}
		if rows.Close() != nil {
			return nil
		}

		// if the tag id doesn't exist the query won't return a name
		if name == "" {
			return nil
		}

		result.Videos = vids
		result.TagName = name
		// jsonify results
		str, _ := json.Marshal(result)
		return str
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
	AddHandler("readThumbnail", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			Movieid int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		var pic []byte

		query := fmt.Sprintf("SELECT thumbnail FROM videos WHERE movie_id=%d", args.Movieid)

		err := database.QueryRow(query).Scan(&pic)
		if err != nil {
			fmt.Printf("the thumbnail of movie id %d couldn't be found", args.Movieid)
			return nil
		}

		return pic
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
	AddHandler("getRandomMovies", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			Number int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
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
				panic(err.Error()) // proper error handling instead of panic in your app
			}
			// append to final array
			result.Tags = append(result.Tags, tag)
		}

		// jsonify results
		str, _ := json.Marshal(result)
		return str
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
	AddHandler("getSearchKeyWord", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			KeyWord string
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf(`SELECT movie_id,movie_name FROM videos 
					WHERE movie_name LIKE '%%%s%%'
					ORDER BY likes DESC, create_date DESC, movie_name`, args.KeyWord)

		result := readVideosFromResultset(database.Query(query))
		// jsonify results
		str, _ := json.Marshal(result)
		return str
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
	AddHandler("loadVideo", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			MovieId int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf(`SELECT movie_name,movie_url,movie_id,thumbnail,poster,likes,quality,length 
										FROM videos WHERE movie_id=%d`, args.MovieId)

		var res types.FullVideoType
		var poster []byte
		var thumbnail []byte

		err := database.QueryRow(query).Scan(&res.MovieName, &res.MovieUrl, &res.MovieId, &thumbnail, &poster, &res.Likes, &res.Quality, &res.Length)
		if err != nil {
			fmt.Printf("error getting full data list of videoid - %d", args.MovieId)
			fmt.Println(err.Error())
			return nil
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

		// jsonify results
		str, _ := json.Marshal(res)
		return str
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
	AddHandler("getStartData", VideoNode, func(info *HandlerInfo) []byte {
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

		// jsonify results
		str, _ := json.Marshal(result)
		return str
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
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	AddHandler("addLike", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			MovieId int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf("update videos set likes = likes + 1 where movie_id = %d", args.MovieId)
		return database.SuccessQuery(query)
	})

	/**
	 * @api {post} /api/video [deleteVideo]
	 * @apiDescription Delete a specific video from database
	 * @apiName deleteVideo
	 * @apiGroup video
	 *
	 * @apiParam {int} MovieId ID of video
	 *
	 * @apiSuccess {string} result 'success' if successfully or error message if not
	 */
	AddHandler("deleteVideo", VideoNode, func(info *HandlerInfo) []byte {
		var args struct {
			MovieId     int
			FullyDelete bool
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		// delete tag constraints
		query := fmt.Sprintf("DELETE FROM video_tags WHERE video_id=%d", args.MovieId)
		err := database.Edit(query)

		// delete actor constraints
		query = fmt.Sprintf("DELETE FROM actors_videos WHERE video_id=%d", args.MovieId)
		err = database.Edit(query)

		// respond only if result not successful
		if err != nil {
			return database.ManualSuccessResponse(err)
		}

		if settings.VideosDeletable() && args.FullyDelete {
			// get physical path of video to delete
			query = fmt.Sprintf("SELECT movie_url FROM videos WHERE movie_id=%d", args.MovieId)
			var vidpath string
			err := database.QueryRow(query).Scan(&vidpath)
			if err != nil {
				return database.ManualSuccessResponse(err)
			}

			err = os.Remove(vidpath)
			if err != nil {
				fmt.Printf("unable to delete file: %s\n", vidpath)
			}
		}

		// delete video row from db
		query = fmt.Sprintf("DELETE FROM videos WHERE movie_id=%d", args.MovieId)
		return database.SuccessQuery(query)
	})
}
