package videoparser

import (
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser/tmdb"
	"regexp"
	"strconv"
	"strings"
)

func startTVShowReindex(files []Show, sett types.SettingsType) {
	// have fun with db insertions here!

	allTVshows := getAllTVShows()

	for _, file := range files {
		// insert new TVShow entry if not existing.
		insertShowIfNotExisting(file, allTVshows)

		insertEpisodesIfNotExisting(file)
	}
}

func insertEpisodesIfNotExisting(show Show) {
	query := "SELECT tvshow_episodes.name, season, episode FROM tvshow_episodes JOIN tvshow t on t.id = tvshow_episodes.tvshow_id WHERE t.name=?"
	rows := database.Query(query, show.Name)

	var dbepisodes []string
	for rows.Next() {
		var epname string
		var season int
		var episode int
		err := rows.Scan(&epname, &season, &episode)
		if err != nil {
			fmt.Println(err.Error())
		}

		dbepisodes = append(dbepisodes, fmt.Sprintf("%s S%02dE%02d.mp4", epname, season, episode))
	}

	// get those episodes that are missing in db
	diff := difference(show.files, dbepisodes)

	for _, s := range diff {
		insertEpisode(s, show.Name)
	}

	fmt.Println("diff is...")
	fmt.Println(len(diff))
}

func insertEpisode(path string, ShowName string) {
	seasonRegex := regexp.MustCompile("S[0-9][0-9]")
	episodeRegex := regexp.MustCompile("E[0-9][0-9]")
	matchENDPattern := regexp.MustCompile(" S[0-9][0-9]E[0-9][0-9].+$")

	seasonStr := seasonRegex.FindString(path)
	episodeStr := episodeRegex.FindString(path)
	extString := matchENDPattern.FindString(path)
	// handle invalid matches
	if len(seasonStr) != 3 || len(episodeStr) != 3 || len(extString) < 8 {
		fmt.Printf("Error inserting episode: %s  -- %s/%s/%s\n", path, seasonStr, episodeStr, extString)
		return
	}

	name := strings.TrimSuffix(path, extString)

	season, err := strconv.ParseInt(seasonStr[1:], 10, 8)
	episode, err := strconv.ParseInt(episodeStr[1:], 10, 8)
	if err != nil {
		fmt.Println(err.Error())
	}

	query := `
INSERT INTO tvshow_episodes (name, season, poster, tvshow_id, episode, filename)
VALUES (?, ?, ?, (SELECT tvshow.id FROM tvshow WHERE tvshow.name=?), ?, ?)`
	err = database.Edit(query, name, season, "", ShowName, episode, path)
	if err != nil {
		fmt.Println(err.Error())
	}
}

// difference returns the elements in `a` that aren't in `b`.
func difference(a, b []string) []string {
	mb := make(map[string]struct{}, len(b))
	for _, x := range b {
		mb[x] = struct{}{}
	}
	var diff []string
	for _, x := range a {
		if _, found := mb[x]; !found {
			diff = append(diff, x)
		}
	}
	return diff
}

func insertShowIfNotExisting(show Show, allShows *[]string) {
	// if show already exists return
	fmt.Println(*allShows)
	for _, s := range *allShows {
		if s == show.Name {
			return
		}
	}

	// insert empty thubnail if tmdb fails
	thubnail := ""

	// load tmdb infos
	tmdbInfo := tmdb.SearchTVShow(show.Name)
	if tmdbInfo != nil {
		thubnail = tmdbInfo.Thumbnail
	}

	// currently the foldernamme == name which mustn't necessarily be
	query := "INSERT INTO tvshow (name, thumbnail, foldername) VALUES (?, ?, ?)"
	err := database.Edit(query, show.Name, thubnail, show.Name)
	if err != nil {
		fmt.Println(err.Error())
	}
}

func getAllTVShows() *[]string {
	query := "SELECT name FROM tvshow"
	rows := database.Query(query)

	var res []string
	for rows.Next() {
		var show string
		rows.Scan(&show)

		res = append(res, show)
	}

	return &res
}
