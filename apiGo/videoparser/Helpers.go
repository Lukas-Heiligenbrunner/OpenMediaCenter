package videoparser

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/jpeg"
	"log"
	"os/exec"
	"strconv"
)

func AppendMessage(message string) {
	msger := TextMessage{
		MessageBase: MessageBase{Action: "message"},
		Message:     message,
	}
	marshal, err := json.Marshal(msger)
	if err != nil {
		return
	}

	IndexSender.Publish(marshal)
}

func SendEvent(message string) {
	msger := ReindexEvent{
		MessageBase: MessageBase{Action: "reindexAction"},
		Event:       message,
	}
	marshal, err := json.Marshal(msger)
	if err != nil {
		return
	}

	IndexSender.Publish(marshal)
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

// parse the thumbail picture from video file
func parseFFmpegPic(path string) (*string, error) {
	app := "ffmpeg"

	cmd := exec.Command(app,
		"-hide_banner",
		"-loglevel", "panic",
		"-ss", "00:04:00",
		"-i", path,
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

	// extract dimensions of picture
	reader := bytes.NewReader(stdout)
	im, err := jpeg.DecodeConfig(reader)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%d %d\n", im.Width, im.Height)
	// todo use this information somewhere...

	backpic64 := fmt.Sprintf("data:image/jpeg;base64,%s", strEncPic)

	return &backpic64, nil
}

func getVideoAttributes(path string) *VideoAttributes {
	app := "mediainfo"

	arg0 := path
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

	// nil slice check of track array
	if len(t.Media.Track) == 0 {
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
