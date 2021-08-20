package api

import (
	"fmt"
	gws "github.com/gowebsecure/goWebSecure-go"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/database/settings"
)

func AddTvshowHandlers() {
	// do not add handlers if tvshows not enabled
	if !settings.TVShowsEnabled() {
		return
	}

	/**
	 * @api {post} /api/tvshow [getTVShows]
	 * @apiDescription get all available tv shows
	 * @apiName getTVShows
	 * @apiGroup TVshow
	 *
	 * @apiSuccess {Object[]} .
	 * @apiSuccess {uint32} .Id tvshow id
	 * @apiSuccess {string} .Name tvshow name
	 */
	gws.AddHandler("getTVShows", TVShowNode, func(info *gws.HandlerInfo) []byte {
		query := "SELECT id, name FROM tvshow"
		rows := database.Query(query)
		return jsonify(readTVshowsFromResultset(rows))
	})

	/**
	 * @api {post} /api/tvshow [getEpisodes]
	 * @apiDescription get all Episodes of a TVShow
	 * @apiName getEpisodes
	 * @apiGroup TVshow
	 *
	 * @apiParam {uint32} ShowID id of tvshow to get episodes from
	 *
	 * @apiSuccess {Object[]} .
	 * @apiSuccess {uint32} .ID episode id
	 * @apiSuccess {string} .Name episode name
	 * @apiSuccess {uint8} .Season Season number
	 * @apiSuccess {uint8} .Episode Episode number
	 */
	gws.AddHandler("getEpisodes", TVShowNode, func(info *gws.HandlerInfo) []byte {
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

	/**
	 * @api {post} /api/tvshow [loadEpisode]
	 * @apiDescription load all info of episode
	 * @apiName loadEpisode
	 * @apiGroup TVshow
	 *
	 * @apiParam {uint32} ID id of episode
	 *
	 * @apiSuccess {uint32} TVShowID episode id
	 * @apiSuccess {string} Name episode name
	 * @apiSuccess {uint8} Season Season number
	 * @apiSuccess {uint8} Episode Episode number
	 * @apiSuccess {string} Path webserver path of video file
	 */
	gws.AddHandler("loadEpisode", TVShowNode, func(info *gws.HandlerInfo) []byte {
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

	/**
	 * @api {post} /api/tvshow [readThumbnail]
	 * @apiDescription Load Thubnail of specific episode
	 * @apiName readThumbnail
	 * @apiGroup TVshow
	 *
	 * @apiParam {int} Id id of episode to load thumbnail
	 *
	 * @apiSuccess {string} . Base64 encoded Thubnail
	 */
	gws.AddHandler("readThumbnail", TVShowNode, func(info *gws.HandlerInfo) []byte {
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
