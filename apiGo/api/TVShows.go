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
}
