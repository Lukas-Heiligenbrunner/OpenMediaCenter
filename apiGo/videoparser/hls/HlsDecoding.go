package hls

import (
	"fmt"
	"log"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"os"
	"os/exec"
	"time"
)

type TranscodingState struct {
	Finished bool
	Active   bool
}

var transcodeAcive = make(map[uint32]TranscodingState)

func startSegmentation(videoid uint32) {
	transcodeAcive[videoid] = TranscodingState{
		Finished: false,
		Active:   true,
	}

	cfg := config.GetConfig()
	outpath := fmt.Sprintf("%s/%d", cfg.General.TmpDir, videoid)

	if !fileExists(outpath) {
		err := os.MkdirAll(outpath, os.ModePerm)
		if err != nil {
			log.Println(err)
		}
	}

	app := "ffmpeg"
	inputpath := GetVideoPathById(videoid)
	fmt.Println(inputpath)
	cmd := exec.Command(app,
		//"-hide_banner",
		//"-loglevel", "panic",
		"-n",
		//"-t", "10.0",
		//"-ss", fmt.Sprintf("%d", id*10),
		"-i", inputpath,
		//"-g", "52",
		//"-sc_threshold", "0",
		//"-force_key_frames", "expr:gte(t,n_forced*10)",
		//"-strict", "experimental",
		//"-movflags", "+frag_keyframe+separate_moof+omit_tfhd_offset+empty_moov",
		//"-c:v", "libx264",
		//"-crf", "18",
		//
		//"-f", "segment",
		//"-segment_time_delta", "0.2",
		//"-segment_format", "mpegts",
		//"-segment_times", commaSeparatedTimes,
		//"-segment_start_number", `0`,
		//"-segment_list_type", "flat",
		//"-segment_list",
		"-preset", "veryfast",
		//"-maxrate", "4000k",
		//"-bufsize", "8000k",
		//"-vf", "scale=1280:-1,format=yuv420p",
		//"-c:a", "aac",
		"-force_key_frames", "expr:gte(t,n_forced*10)",
		"-strict", "-2",
		"-c:a", "aac",
		"-c:v", "libx264",
		"-f", "segment",
		"-segment_list_type", "m3u8",
		"-segment_time", "10.0",
		"-segment_time_delta", "0.001",
		"-segment_list", "test.m3u8", outpath+"/part%02d.ts")

	stdout, err := cmd.Output()
	//
	if err != nil {
		fmt.Println(err.Error())
		fmt.Println(string(err.(*exec.ExitError).Stderr))
	}
	fmt.Println(stdout)
	fmt.Println("finished transcoding")

	transcodeAcive[videoid] = TranscodingState{
		Finished: true,
		Active:   false,
	}
}

func fileExists(path string) bool {
	_, err := os.Stat(path)
	return !os.IsNotExist(err)
}

func GetVideoPathById(videoid uint32) string {
	query := fmt.Sprintf(`SELECT movie_url FROM videos WHERE movie_id=%d`, videoid)
	var url string

	err := database.QueryRow(query).Scan(&url)
	if err != nil {
		return ""
	}

	mSettings, _, _ := database.GetSettings()
	vidFolder := config.GetConfig().General.ReindexPrefix + mSettings.VideoPath
	return vidFolder + url
}

func GetSegment(segIdx uint32, videoid uint32) string {
	cfg := config.GetConfig()

	i, ok := transcodeAcive[videoid]
	if ok {
		if !i.Active && !i.Finished {
			go startSegmentation(videoid)
		}
	} else {
		go startSegmentation(videoid)
	}

	// todo timeout
	tspath := fmt.Sprintf("%s/%d/part%02d.ts", cfg.General.TmpDir, videoid, segIdx)
	if ok && i.Finished == true {
		return tspath
	}

	fmt.Println("checking if part exists")
	for !fileExists(fmt.Sprintf("%s/%d/part%02d.ts", cfg.General.TmpDir, videoid, segIdx+1)) {
		time.Sleep(100 * time.Millisecond)
	}
	return tspath
}
