package api

import "openmediacenter/apiGo/database"

func AddTvshowHandlers() {
	var dT struct {
		TagId int
		Force bool
	}
	AddHandler("getTVShows", TVShowNode, &dT, func() []byte {
		query := "SELECT id, name FROM tvshow"
		rows := database.Query(query)
		return jsonify(readTVshowsFromResultset(rows))
	})
}
