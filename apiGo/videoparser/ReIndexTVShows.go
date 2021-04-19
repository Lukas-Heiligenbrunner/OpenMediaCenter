package videoparser

import (
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
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
	query := fmt.Sprintf("SELECT tvshow_episodes.name, season, episode FROM tvshow_episodes JOIN tvshow t on t.id = tvshow_episodes.tvshow_id WHERE t.name='%s'", show.Name)
	rows := database.Query(query)

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
	fmt.Println(diff)
}

func insertEpisode(path string, ShowName string) {
	seasonRegex := regexp.MustCompile("S[0-9][0-9]")
	episodeRegex := regexp.MustCompile("E[0-9][0-9]")
	matchENDPattern := regexp.MustCompile(" S[0-9][0-9]E[0-9][0-9].+$")

	seasonStr := seasonRegex.FindString(path)[1:]
	episodeStr := episodeRegex.FindString(path)[1:]
	extString := matchENDPattern.FindString(path)
	name := strings.TrimSuffix(path, extString)

	season, err := strconv.ParseInt(seasonStr, 10, 8)
	episode, err := strconv.ParseInt(episodeStr, 10, 8)
	if err != nil {
		fmt.Println(err.Error())
	}

	query := fmt.Sprintf(`
INSERT INTO tvshow_episodes (name, season, poster, tvshow_id, episode)
VALUES ('%s', %d, '%s', (SELECT tvshow.id FROM tvshow WHERE tvshow.name='%s'), %d)`, name, season, "", ShowName, episode)
	err = database.Edit(query)
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

	// todo load tmdb pic
	query := fmt.Sprintf("INSERT INTO tvshow (name, thumbnail) VALUES ('%s', '%s')", show.Name, "")
	err := database.Edit(query)
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
