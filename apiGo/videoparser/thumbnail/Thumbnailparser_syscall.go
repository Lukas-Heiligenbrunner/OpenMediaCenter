// +build !sharedffmpeg

package thumbnail

import (
	"encoding/json"
	"fmt"
	"os/exec"
	"strconv"
)

type ExtDependencySupport struct {
	FFMpeg    bool
	MediaInfo bool
}

func Parse(filename string, time uint64) (*string, *VidInfo, error) {
	// check if the extern dependencies are available
	mExtDepsAvailable := checkExtDependencySupport()
	fmt.Printf("FFMPEG support: %t\n", mExtDepsAvailable.FFMpeg)
	fmt.Printf("MediaInfo support: %t\n", mExtDepsAvailable.MediaInfo)

	var pic *string = nil
	var info *VidInfo = nil

	if mExtDepsAvailable.FFMpeg {
		p, err := parseFFmpegPic(filename, time)
		if err != nil {
			return nil, nil, err
		}
		pic = EncodeBase64(p, "image/jpeg")
	}

	if mExtDepsAvailable.MediaInfo {
		i, err := getVideoAttributes(filename)
		if err != nil {
			return nil, nil, err
		}
		info = i
	}
	return pic, info, nil
}

// check if a specific system command is available
func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}

// ext dependency support check
func checkExtDependencySupport() *ExtDependencySupport {
	var extDepsAvailable ExtDependencySupport

	extDepsAvailable.FFMpeg = commandExists("ffmpeg")
	extDepsAvailable.MediaInfo = commandExists("mediainfo")

	return &extDepsAvailable
}

func secToString(time uint64) string {
	return fmt.Sprintf("%02d:%02d:%02d", time/3600, (time/60)%60, time%60)
}

// parse the thumbail picture from video file
func parseFFmpegPic(path string, time uint64) (*[]byte, error) {
	app := "ffmpeg"

	cmd := exec.Command(app,
		"-hide_banner",
		"-loglevel", "panic",
		"-ss", secToString(time),
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

	return &stdout, nil
}

func getVideoAttributes(path string) (*VidInfo, error) {
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
				Height   string
			}
		}
	}
	err = json.Unmarshal(stdout, &t)
	if err != nil {
		return nil, err
	}

	duration, err := strconv.ParseFloat(t.Media.Track[0].Duration, 32)
	filesize, err := strconv.Atoi(t.Media.Track[0].FileSize)
	width, err := strconv.Atoi(t.Media.Track[1].Width)
	height, err := strconv.Atoi(t.Media.Track[1].Height)
	if err != nil {
		return nil, err
	}

	ret := VidInfo{
		Length:    uint64(duration),
		Size:      int64(filesize),
		Width:     uint32(width),
		Height:    uint32(height),
		FrameRate: 0,
	}

	return &ret, nil
}
