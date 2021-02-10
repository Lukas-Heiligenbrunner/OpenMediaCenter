package videoparser

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser/tmdb"
	"os/exec"
	"regexp"
	"strconv"
)

var mSettings types.SettingsType

func ReIndexVideos(path []string, sett types.SettingsType) {
	mSettings = sett

	for _, s := range path {
		processVideo(s)
	}
}

func processVideo(fileNameOrig string) {
	fmt.Printf("Processing %s video!\n", fileNameOrig)

	// match the file extension
	r, _ := regexp.Compile(`\..*$`)
	fileName := r.ReplaceAllString(fileNameOrig, "")

	year, fileName := matchYear(fileName)

	// now we should look if this video already exists in db
	query := "SELECT * FROM videos WHERE movie_name = ?"
	if !database.Query(query, fileName).Next() {
		fmt.Printf("The Video %s does't exist! Adding it to database.\n", fileName)

		addVideo(fileName, fileNameOrig, year)
	}
}

// add a video to the database
func addVideo(videoName string, fileName string, year int) {
	ppic, perr := parseFFmpegPic(fileName)
	if perr != nil {
		fmt.Printf("FFmpeg error occured: %s", perr.Error())
	}

	vidAtr := getVideoAttributes(fileName)

	var poster *string

	// if TMDB grabbing is enabled serach in api for video...
	if mSettings.TMDBGrabbing {
		tmdbData := tmdb.SearchVideo(videoName, year)
		if tmdbData != nil {
			// reassign parsed pic as poster
			poster = ppic
			// and tmdb pic as thumbnail
			ppic = &tmdbData.Thumbnail
		}
	}

	query := `INSERT INTO videos(movie_name,poster,thumbnail,quality,length) VALUES (?,?,?,?,?)`
	err := database.Edit(query, videoName, poster, ppic, vidAtr.Width, vidAtr.Duration)
	if err != nil {
		fmt.Printf("Failed to insert video into db: %s\n", err.Error())
	}

	if mSettings.TMDBGrabbing {
		// todo add tmdb tags
	}

	// todo is this neccessary
	msgs := <-messageBuffer
	msgs = append(msgs, fmt.Sprintf("added successfully - %s", videoName))
	messageBuffer <- msgs
}

func matchYear(fileName string) (int, string) {
	r, _ := regexp.Compile(`\([0-9]{4}?\)`)
	years := r.FindAllString(fileName, -1)
	if len(years) == 0 {
		return -1, fileName
	}

	year, err := strconv.Atoi(years[len(years)-1])

	if err != nil {
		return -1, fileName
	}

	// cut out year from filename
	return year, r.ReplaceAllString(fileName, "")
}

// todo check this method
func parseFFmpegPic(fileName string) (*string, error) {
	app := "ffmpeg"

	arg0 := "-hide_banner"
	arg1 := "-loglevel panic"
	arg2 := "-ss 00:04:00"
	arg3 := fmt.Sprintf(`-i "%s%s"`, mSettings.VideoPath, fileName)
	arg4 := "-vframes 1"
	arg5 := "-q:v 2"
	arg6 := "-f singlejpeg"
	arg7 := "pipe:1 2>/dev/null"

	cmd := exec.Command(app, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7)
	stdout, err := cmd.Output()

	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	backpic64 := "data:image/jpeg;base64," + base64.StdEncoding.EncodeToString(stdout)

	return &backpic64, nil
}

type VideoAttributes struct {
	Duration float32
	FileSize uint
	Width    uint
}

func getVideoAttributes(fileName string) *VideoAttributes {
	app := "mediainfo"

	arg0 := fmt.Sprintf(`%s%s`, mSettings.VideoPath, fileName)
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
