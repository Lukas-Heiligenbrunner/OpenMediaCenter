package api

import (
	"fmt"
	"openmediacenter/apiGo/database"
)

func AddTvshowHandlers() {
	AddHandler("getTVShows", TVShowNode, func(info *HandlerInfo) []byte {
		query := "SELECT id, name FROM tvshow"
		rows := database.Query(query)
		return jsonify(readTVshowsFromResultset(rows))
	})

	AddHandler("getEpisodes", TVShowNode, func(info *HandlerInfo) []byte {
		var args struct {
			ShowID uint32
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf("SELECT id, name, season, episode FROM tvshow_episodes WHERE tvshow_id=%d", args.ShowID)
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

	AddHandler("loadEpisode", TVShowNode, func(info *HandlerInfo) []byte {
		var args struct {
			ID uint32
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := fmt.Sprintf(`
SELECT tvshow_episodes.name, season, tvshow_id, episode, filename, t.foldername
FROM tvshow_episodes 
JOIN tvshow t on t.id = tvshow_episodes.tvshow_id
WHERE tvshow_episodes.id=%d`, args.ID)
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

	AddHandler("readThumbnail", TVShowNode, func(info *HandlerInfo) []byte {
		var args struct {
			Id int
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		var pic []byte

		query := fmt.Sprintf("SELECT thumbnail FROM tvshow WHERE id=%d", args.Id)

		err := database.QueryRow(query).Scan(&pic)
		if err != nil {
			fmt.Printf("the thumbnail of movie id %d couldn't be found", args.Id)
			return nil
		}

		return pic
	})
}
