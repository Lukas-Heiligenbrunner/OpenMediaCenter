package videoparser

import (
	"fmt"
	"io/ioutil"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"os"
	"path/filepath"
	"strings"
)

type StatusMessage struct {
	Messages         []string
	ContentAvailable bool
}

func getVideoTypes() []string {
	return []string{".mp4", ".mov", ".mkv", ".flv", ".avi", ".mpeg", ".m4v"}
}

func ValidVideoSuffix(filename string) bool {
	validExts := getVideoTypes()
	for _, validExt := range validExts {
		if strings.HasSuffix(filename, validExt) {
			return true
		}
	}
	return false
}

func StartReindex() bool {
	fmt.Println("starting reindex..")
	SendEvent("start")
	AppendMessage("starting reindex..")

	mSettings, _, _ := database.GetSettings()

	// add the path prefix to videopath
	vidFolder := config.GetConfig().General.ReindexPrefix + mSettings.VideoPath

	// check if path even exists
	if _, err := os.Stat(vidFolder); os.IsNotExist(err) {
		fmt.Println("Reindex path doesn't exist!")
		AppendMessage(fmt.Sprintf("Reindex path doesn't exist! :%s", vidFolder))
		SendEvent("stop")
		return false
	}

	var files []string
	err := filepath.Walk(vidFolder, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Println(err.Error())
			return err
		}

		if !info.IsDir() && ValidVideoSuffix(info.Name()) {
			files = append(files, info.Name())
		}
		return nil
	})

	if err != nil {
		fmt.Println(err.Error())
	}
	// start reindex process
	AppendMessage("Starting Reindexing!")
	InitDeps(&mSettings)
	go ReIndexVideos(files)
	return true
}

type Show struct {
	Name  string
	files []string
}

// StartTVShowReindex reindex dir walks for TVShow reindex
func StartTVShowReindex() {
	fmt.Println("starting tvshow reindex..")
	SendEvent("start")
	AppendMessage("starting tvshow reindex...")

	mSettings, PathPrefix, _ := database.GetSettings()
	// add the path prefix to videopath
	mSettings.EpisodePath = PathPrefix + mSettings.EpisodePath

	// add slash suffix if not existing
	if !strings.HasSuffix(mSettings.EpisodePath, "/") {
		mSettings.EpisodePath += "/"
	}

	// check if path even exists
	if _, err := os.Stat(mSettings.EpisodePath); os.IsNotExist(err) {
		msg := fmt.Sprintf("Reindex path doesn't exist! :%s", mSettings.EpisodePath)
		fmt.Println(msg)
		AppendMessage(msg)
		SendEvent("stop")
		return
	}

	var files []Show

	filess, err := ioutil.ReadDir(mSettings.EpisodePath)
	if err != nil {
		fmt.Println(err.Error())
	}

	for _, file := range filess {
		if file.IsDir() {
			elem := Show{
				Name:  file.Name(),
				files: nil,
			}

			fmt.Println(file.Name())

			episodefiles, err := ioutil.ReadDir(mSettings.EpisodePath + file.Name())
			if err != nil {
				fmt.Println(err.Error())
			}

			for _, epfile := range episodefiles {
				if ValidVideoSuffix(epfile.Name()) {
					elem.files = append(elem.files, epfile.Name())
				}
			}
			files = append(files, elem)
		}
	}

	if err != nil {
		fmt.Println(err.Error())
	}

	// start reindex process
	AppendMessage("Starting Reindexing!")
	go startTVShowReindex(files)
}

func StartCleanup() {
	// todo start cleanup
}
