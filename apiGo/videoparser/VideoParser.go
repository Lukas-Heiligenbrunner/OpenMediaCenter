package videoparser

import (
	"fmt"
	"openmediacenter/apiGo/database"
	"os"
	"path/filepath"
	"strings"
)

var messageBuffer []string
var contentAvailable = false

type StatusMessage struct {
	Messages         []string
	ContentAvailable bool
}

func StartReindex() bool {
	messageBuffer = []string{}
	contentAvailable = true

	fmt.Println("starting reindex..")

	mSettings := database.GetSettings()
	// add the path prefix to videopath
	mSettings.VideoPath = mSettings.PathPrefix + mSettings.VideoPath

	// check if path even exists
	if _, err := os.Stat(mSettings.VideoPath); os.IsNotExist(err) {
		fmt.Println("Reindex path doesn't exist!")
		return false
	}

	var files []string
	err := filepath.Walk(mSettings.VideoPath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			fmt.Println(err.Error())
			return err
		}

		if !info.IsDir() && strings.HasSuffix(info.Name(), ".mp4") {
			files = append(files, info.Name())
		}
		return nil
	})

	if err != nil {
		fmt.Println(err.Error())
	}
	// start reindex process
	AppendMessageBuffer("Starting Reindexing!")
	go ReIndexVideos(files, mSettings)
	return true
}

// StartTVShowReindex reindex dir walks for TVShow reindex
func StartTVShowReindex() {
	// todo implement walking through dirs and reindex!
}

func GetStatusMessage() *StatusMessage {
	msg := StatusMessage{
		Messages:         messageBuffer,
		ContentAvailable: contentAvailable,
	}

	messageBuffer = []string{}

	return &msg
}

func StartCleanup() {
	// todo start cleanup
}
