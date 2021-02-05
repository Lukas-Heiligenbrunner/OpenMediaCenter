package api

import (
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/database"
)

func AddVideoHandlers() {
	type GetMoviesRequest struct {
		Tag int
	}

	var mrq GetMoviesRequest
	AddHandler("getMovies", &mrq, func() []byte {
		var query string
		if mrq.Tag != 0 {
			query = fmt.Sprintf(`SELECT movie_id,movie_name FROM videos
					INNER JOIN video_tags vt on videos.movie_id = vt.video_id
					INNER JOIN tags t on vt.tag_id = t.tag_id
					WHERE t.tag_id = '%d'
					ORDER BY likes DESC, create_date, movie_name`, mrq.Tag)
		} else {
			query = "SELECT movie_id,movie_name FROM videos ORDER BY create_date DESC, movie_name"
		}
		rows := database.Query(query)

		type VideoUnloadedType struct {
			Movie_id   int
			Movie_name string
		}

		type ArrVideo []VideoUnloadedType
		result := ArrVideo{}

		for rows.Next() {
			var vid VideoUnloadedType
			err := rows.Scan(&vid.Movie_id, &vid.Movie_name)
			if err != nil {
				panic(err.Error()) // proper error handling instead of panic in your app
			}
			result = append(result, vid)
		}
		rows.Close()

		str, _ := json.Marshal(result)
		return str
	})

	type ReadThumbnailRequest struct {
		Movieid int
	}

	var rtn ReadThumbnailRequest
	AddHandler("readThumbnail", &rtn, func() []byte {
		query := fmt.Sprintf("SELECT thumbnail FROM videos WHERE movie_id='%d'", rtn.Movieid)

		var pic []byte
		err := database.QueryRow(query).Scan(&pic)
		if err != nil {
			fmt.Printf("the thumbnail of movie id %d couldn't be found", rtn.Movieid)
			return nil
		}

		return pic
	})
}
