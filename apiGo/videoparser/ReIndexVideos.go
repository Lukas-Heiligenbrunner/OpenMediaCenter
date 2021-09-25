package videoparser

import (
	"database/sql"
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser/thumbnail"
	"openmediacenter/apiGo/videoparser/tmdb"
	"regexp"
	"strconv"
	"strings"
)

var mSettings *types.SettingsType

// default Tag ids
const (
	FullHd     = 2
	Hd         = 4
	LowQuality = 3
)

type VideoAttributes struct {
	Duration float32
	FileSize uint
	Width    uint
}

func InitDeps(sett *types.SettingsType) {
	mSettings = sett
}

func ReIndexVideos(path []string) {
	// filter out those urls which are already existing in db
	nonExisting := filterExisting(path)

	fmt.Printf("There are %d videos not existing in db.\n", len(*nonExisting))

	for _, s := range *nonExisting {
		ProcessVideo(s)
	}

	AppendMessage("reindex finished successfully!")
	SendEvent("stop")
	fmt.Println("Reindexing finished!")
}

// filter those entries from array which are already existing!
func filterExisting(paths []string) *[]string {
	var nameStr string

	// build the query string with files on disk
	for i, s := range paths {
		// escape ' in url name
		s = strings.Replace(s, "'", "\\'", -1)
		nameStr += "SELECT '" + s + "' "

		// if first index add as url
		if i == 0 {
			nameStr += "AS url "
		}

		// if not last index add union all
		if i != len(paths)-1 {
			nameStr += "UNION ALL "
		}
	}

	query := fmt.Sprintf("SELECT * FROM (%s) urls WHERE urls.url NOT IN(SELECT movie_url FROM videos)", nameStr)
	rows := database.Query(query)

	var resultarr []string
	// parse the result rows into a array
	for rows.Next() {
		var url string
		err := rows.Scan(&url)
		if err != nil {
			continue
		}
		resultarr = append(resultarr, url)
	}
	rows.Close()

	return &resultarr
}

func ProcessVideo(fileNameOrig string) {
	fmt.Printf("Processing %s video\n", fileNameOrig)

	// match the file extension
	r := regexp.MustCompile(`\.[a-zA-Z0-9]+$`)
	fileName := r.ReplaceAllString(fileNameOrig, "")

	// match the year and cut year from name
	year, fileName := matchYear(fileName)

	fmt.Printf("The Video %s doesn't exist! Adding it to database.\n", fileName)
	addVideo(fileName, fileNameOrig, year)
}

// add a video to the database
func addVideo(videoName string, fileName string, year int) {
	var ppic *string
	var poster *string
	var tmdbData *tmdb.VideoTMDB
	var err error
	var insertid int64

	vidFolder := config.GetConfig().General.ReindexPrefix + mSettings.VideoPath

	// if TMDB grabbing is enabled serach in api for video...
	if mSettings.TMDBGrabbing {
		tmdbData = tmdb.SearchVideo(videoName, year)
		if tmdbData != nil {
			// and tmdb pic as thumbnail
			poster = &tmdbData.Thumbnail
		}
	}

	// parse pic from 4min frame
	ppic, vinfo, err := thumbnail.Parse(vidFolder+fileName, 240)
	// use parsed pic also for poster pic
	if poster == nil {
		poster = ppic
	}

	if err != nil {
		fmt.Printf("FFmpeg error occured: %s\n", err.Error())

		query := `INSERT INTO videos(movie_name,movie_url) VALUES (?,?)`
		err, insertid = database.Insert(query, videoName, fileName)

	} else {
		query := `INSERT INTO videos(movie_name,movie_url,poster,thumbnail,quality,length) VALUES (?,?,?,?,?,?)`
		err, insertid = database.Insert(query, videoName, fileName, ppic, poster, vinfo.Width, vinfo.Length)

		// add default tags
		if vinfo.Width != 0 && err == nil {
			insertSizeTag(uint(vinfo.Width), uint(insertid))
		}
	}

	if err != nil {
		fmt.Printf("Failed to insert video into db: %s\n", err.Error())
		return
	}

	// add tmdb tags
	if mSettings.TMDBGrabbing && tmdbData != nil {
		insertTMDBTags(tmdbData.GenreIds, insertid)
	}

	AppendMessage(fmt.Sprintf("%s - added!", videoName))
}

func matchYear(fileName string) (int, string) {
	r := regexp.MustCompile(`\([0-9]{4}?\)`)
	years := r.FindAllString(fileName, -1)
	if len(years) == 0 {
		return -1, fileName
	}
	yearStr := years[len(years)-1]
	// get last year occurance and cut first and last char
	year, err := strconv.Atoi(yearStr[1 : len(yearStr)-1])

	if err != nil {
		return -1, fileName
	}

	// cut out year from filename
	return year, r.ReplaceAllString(fileName, "")
}

// insert the default size tags to corresponding video
func insertSizeTag(width uint, videoId uint) {
	var tagType uint

	if width >= 1080 {
		tagType = FullHd
	} else if width >= 720 {
		tagType = Hd
	} else {
		tagType = LowQuality
	}

	query := fmt.Sprintf("INSERT INTO video_tags(video_id,tag_id) VALUES (%d,%d)", videoId, tagType)
	err := database.Edit(query)
	if err != nil {
		fmt.Printf("Eror occured while adding default Tag: %s\n", err.Error())
	}
}

// insert id array of tmdb geners to database
func insertTMDBTags(ids []int, videoId int64) {
	genres := tmdb.GetGenres()

	for _, id := range ids {
		var idGenre *tmdb.TMDBGenre
		for _, genre := range *genres {
			if genre.Id == id {
				idGenre = &genre
				break
			}
		}
		// skip tag if name couldn't be found
		if idGenre == nil {
			continue
		}

		// now we check if the tag we want to add already exists
		tagId := createTagToDB(idGenre.Name)

		// now we add the tag
		query := fmt.Sprintf("INSERT INTO video_tags(video_id,tag_id) VALUES (%d,%d)", videoId, tagId)
		_ = database.Edit(query)
	}
}

// returns id of tag or creates it if not existing
func createTagToDB(tagName string) int64 {
	query := fmt.Sprintf("SELECT tag_id FROM tags WHERE tag_name = %s", tagName)
	var id int64
	err := database.QueryRow(query).Scan(&id)
	if err == sql.ErrNoRows {
		// tag doesn't exist -- add it
		query = fmt.Sprintf("INSERT INTO tags (tag_name) VALUES (%s)", tagName)
		err, id = database.Insert(query)
	}
	return id
}
