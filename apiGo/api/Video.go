package api

import (
	"encoding/json"
	"fmt"
	"net/url"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"strconv"
	"strings"
)

func AddVideoHandlers() {
	getVideoHandlers()
	loadVideosHandlers()
	addToVideoHandlers()
}

func getVideoHandlers() {
	var mrq struct {
		Tag int
	}
	AddHandler("getMovies", VideoNode, &mrq, func() []byte {
		var query string
		// 1 is the id of the ALL tag
		if mrq.Tag != 1 {
			query = fmt.Sprintf(`SELECT movie_id,movie_name FROM videos
					INNER JOIN video_tags vt on videos.movie_id = vt.video_id
					INNER JOIN tags t on vt.tag_id = t.tag_id
					WHERE t.tag_id = '%d'
					ORDER BY likes DESC, create_date, movie_name`, mrq.Tag)
		} else {
			query = "SELECT movie_id,movie_name FROM videos ORDER BY create_date DESC, movie_name"
		}

		result := readVideosFromResultset(database.Query(query))
		// jsonify results
		str, _ := json.Marshal(result)
		return str
	})

	var rtn struct {
		Movieid int
	}
	AddHandler("readThumbnail", VideoNode, &rtn, func() []byte {
		var pic []byte

		query := fmt.Sprintf("SELECT thumbnail FROM videos WHERE movie_id='%d'", rtn.Movieid)

		err := database.QueryRow(query).Scan(&pic)
		if err != nil {
			fmt.Printf("the thumbnail of movie id %d couldn't be found", rtn.Movieid)
			return nil
		}

		return pic
	})

	var grm struct {
		Number int
	}
	AddHandler("getRandomMovies", VideoNode, &grm, func() []byte {
		var result struct {
			Tags   []types.Tag
			Videos []types.VideoUnloadedType
		}

		query := fmt.Sprintf("SELECT movie_id,movie_name FROM videos ORDER BY RAND() LIMIT %d", grm.Number)
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

	var gsk struct {
		KeyWord string
	}
	AddHandler("getSearchKeyWord", VideoNode, &gsk, func() []byte {
		query := fmt.Sprintf(`SELECT movie_id,movie_name FROM videos 
					WHERE movie_name LIKE '%%%s%%'
					ORDER BY likes DESC, create_date DESC, movie_name`, gsk.KeyWord)

		result := readVideosFromResultset(database.Query(query))
		// jsonify results
		str, _ := json.Marshal(result)
		return str
	})
}

// function to handle stuff for loading specific videos and startdata
func loadVideosHandlers() {
	var lv struct {
		MovieId int
	}
	AddHandler("loadVideo", VideoNode, &lv, func() []byte {
		query := fmt.Sprintf(`SELECT movie_name,movie_id,movie_url,thumbnail,poster,likes,quality,length 
										FROM videos WHERE movie_id=%d`, lv.MovieId)

		var res types.FullVideoType
		var poster []byte
		var thumbnail []byte

		err := database.QueryRow(query).Scan(&res.MovieName, &res.MovieId, &res.MovieUrl, &thumbnail, &poster, &res.Likes, &res.Quality, &res.Length)
		if err != nil {
			fmt.Printf("error getting full data list of videoid - %d", lv.MovieId)
			fmt.Println(err.Error())
			return nil
		}

		// we ned to urlencode the movieurl
		res.MovieUrl = url.PathEscape(res.MovieUrl)
		res.MovieUrl = strings.ReplaceAll(res.MovieUrl, "%2F", "/")
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
					GROUP BY t.tag_id`, lv.MovieId)

		res.Tags = readTagsFromResultset(database.Query(query))

		query = fmt.Sprintf(`SELECT * FROM tags
					WHERE tag_id NOT IN (
						SELECT video_tags.tag_id FROM video_tags
					WHERE video_id=%d)
					ORDER BY rand()
					LIMIT 5`, lv.MovieId)

		res.SuggestedTag = readTagsFromResultset(database.Query(query))

		// query the actors corresponding to video
		query = fmt.Sprintf(`SELECT a.actor_id, name, thumbnail FROM actors_videos
					JOIN actors a on actors_videos.actor_id = a.actor_id
					WHERE actors_videos.video_id=%d`, lv.MovieId)

		res.Actors = readActorsFromResultset(database.Query(query))

		// jsonify results
		str, _ := json.Marshal(res)
		return str
	})

	AddHandler("getStartData", VideoNode, nil, func() []byte {
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
	var al struct {
		MovieId int
	}
	AddHandler("addLike", VideoNode, &al, func() []byte {
		query := fmt.Sprintf("update videos set likes = likes + 1 where movie_id = %d", al.MovieId)
		return database.SuccessQuery(query)
	})

	var dv struct {
		MovieId int
	}
	AddHandler("deleteVideo", VideoNode, &dv, func() []byte {
		query := fmt.Sprintf("DELETE FROM videos WHERE movie_id=%d", al.MovieId)
		return database.SuccessQuery(query)
	})
}
