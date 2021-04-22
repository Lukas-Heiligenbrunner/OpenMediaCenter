package api

import (
	"fmt"
	"openmediacenter/apiGo/database"
)

func AddTvshowHandlers() {
	AddHandler("getTVShows", TVShowNode, nil, func() []byte {
		query := "SELECT id, name FROM tvshow"
		rows := database.Query(query)
		return jsonify(readTVshowsFromResultset(rows))
	})

	var ge struct {
		ShowID uint32
	}
	AddHandler("getEpisodes", TVShowNode, &ge, func() []byte {
		query := fmt.Sprintf("SELECT id, name, season, episode FROM tvshow_episodes WHERE tvshow_id=%d", ge.ShowID)
		rows := database.Query(query)

		type Episode struct {
			ID      uint32
			Name    string
			Season  uint8
			Episode uint8
		}

		episodes := []Episode{}
		for rows.Next() {
			var ep Episode
			err := rows.Scan(&ep.ID, &ep.Name, &ep.Season, &ep.Episode)
			if err != nil {
				fmt.Println(err.Error())
				continue
			}

			episodes = append(episodes, ep)
		}

		return jsonify(episodes)
	})

	var le struct {
		ID uint32
	}
	AddHandler("loadEpisode", TVShowNode, &le, func() []byte {
		query := fmt.Sprintf(`
SELECT tvshow_episodes.name, season, tvshow_id, episode, filename, t.foldername
FROM tvshow_episodes 
JOIN tvshow t on t.id = tvshow_episodes.tvshow_id
WHERE tvshow_episodes.id=%d`, le.ID)
		row := database.QueryRow(query)

		var ret struct {
			Name     string
			Season   uint8
			Episode  uint8
			TVShowID uint32
			Path     string
		}
		var filename string
		var foldername string

		err := row.Scan(&ret.Name, &ret.Season, &ret.TVShowID, &ret.Episode, &filename, &foldername)
		if err != nil {
			fmt.Println(err.Error())
			return nil
		}

		ret.Path = foldername + "/" + filename

		return jsonify(ret)
	})
}
