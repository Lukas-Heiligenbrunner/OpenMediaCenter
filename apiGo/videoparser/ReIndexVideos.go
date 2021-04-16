package videoparser

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser/tmdb"
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

var mSettings types.SettingsType
var mExtDepsAvailable *ExtDependencySupport

// default Tag ids
const (
	FullHd     = 2
	Hd         = 4
	LowQuality = 3
)

type ExtDependencySupport struct {
	FFMpeg    bool
	MediaInfo bool
}

type VideoAttributes struct {
	Duration float32
	FileSize uint
	Width    uint
}

func ReIndexVideos(path []string, sett types.SettingsType) {
	mSettings = sett
	// check if the extern dependencies are available
	mExtDepsAvailable = checkExtDependencySupport()
	fmt.Printf("FFMPEG support: %t\n", mExtDepsAvailable.FFMpeg)
	fmt.Printf("MediaInfo support: %t\n", mExtDepsAvailable.MediaInfo)

	// filter out those urls which are already existing in db
	nonExisting := filterExisting(path)

	fmt.Printf("There are %d videos not existing in db.\n", len(*nonExisting))

	for _, s := range *nonExisting {
		processVideo(s)
	}

	AppendMessageBuffer("reindex finished successfully!")

	contentAvailable = false
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

func processVideo(fileNameOrig string) {
	fmt.Printf("Processing %s video-", fileNameOrig)

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

	// initialize defaults
	vidAtr := &VideoAttributes{
		Duration: 0,
		FileSize: 0,
		Width:    0,
	}

	if mExtDepsAvailable.FFMpeg {
		ppic, err = parseFFmpegPic(fileName)
		if err != nil {
			fmt.Printf("FFmpeg error occured: %s\n", err.Error())
		} else {
			fmt.Println("successfully extracted thumbnail!!")
		}
	}

	if mExtDepsAvailable.MediaInfo {
		atr := getVideoAttributes(fileName)
		if atr != nil {
			vidAtr = atr
		}
	}

	// if TMDB grabbing is enabled serach in api for video...
	if mSettings.TMDBGrabbing {
		tmdbData = tmdb.SearchVideo(videoName, year)
		if tmdbData != nil {
			// reassign parsed pic as poster
			poster = ppic
			// and tmdb pic as thumbnail
			ppic = &tmdbData.Thumbnail
		}
	}

	query := `INSERT INTO videos(movie_name,movie_url,poster,thumbnail,quality,length) VALUES (?,?,?,?,?,?)`
	err, insertId := database.Insert(query, videoName, fileName, poster, ppic, vidAtr.Width, vidAtr.Duration)
	if err != nil {
		fmt.Printf("Failed to insert video into db: %s\n", err.Error())
		return
	}

	// add default tags
	if vidAtr.Width != 0 {
		insertSizeTag(vidAtr.Width, uint(insertId))
	}

	// add tmdb tags
	if mSettings.TMDBGrabbing && tmdbData != nil {
		insertTMDBTags(tmdbData.GenreIds, insertId)
	}

	AppendMessageBuffer(fmt.Sprintf("%s - added!", videoName))
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

// parse the thumbail picture from video file
func parseFFmpegPic(fileName string) (*string, error) {
	app := "ffmpeg"

	cmd := exec.Command(app,
		"-hide_banner",
		"-loglevel", "panic",
		"-ss", "00:04:00",
		"-i", mSettings.VideoPath+fileName,
		"-vframes", "1",
		"-q:v", "2",
		"-f", "singlejpeg",
		"pipe:1")

	stdout, err := cmd.Output()

	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(string(err.(*exec.ExitError).Stderr))
		return nil, err
	}

	strEncPic := base64.StdEncoding.EncodeToString(stdout)
	if strEncPic == "" {
		return nil, nil
	}
	backpic64 := fmt.Sprintf("data:image/jpeg;base64,%s", strEncPic)

	return &backpic64, nil
}

func getVideoAttributes(fileName string) *VideoAttributes {
	app := "mediainfo"

	arg0 := mSettings.VideoPath + fileName
	arg1 := "--Output=JSON"

	cmd := exec.Command(app, arg1, "-f", arg0)
	stdout, err := cmd.Output()

	var t struct {
		Media struct {
			Track []struct {
				Duration string
				FileSize string
				Width    string
			}
		}
	}
	err = json.Unmarshal(stdout, &t)

	if err != nil {
		fmt.Println(err.Error())
		return nil
	}

	duration, err := strconv.ParseFloat(t.Media.Track[0].Duration, 32)
	filesize, err := strconv.Atoi(t.Media.Track[0].FileSize)
	width, err := strconv.Atoi(t.Media.Track[1].Width)

	ret := VideoAttributes{
		Duration: float32(duration),
		FileSize: uint(filesize),
		Width:    uint(width),
	}

	return &ret
}

func AppendMessageBuffer(message string) {
	messageBuffer = append(messageBuffer, message)
}

// ext dependency support check
func checkExtDependencySupport() *ExtDependencySupport {
	var extDepsAvailable ExtDependencySupport

	extDepsAvailable.FFMpeg = commandExists("ffmpeg")
	extDepsAvailable.MediaInfo = commandExists("mediainfo")

	return &extDepsAvailable
}

// check if a specific system command is available
func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
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
