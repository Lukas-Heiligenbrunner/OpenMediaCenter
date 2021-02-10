package videoparser

import (
	"fmt"
	"openmediacenter/apiGo/database"
	"os"
	"path/filepath"
	"strings"
)

var messageBuffer chan []string
var contentAvailable = false

type StatusMessage struct {
	Messages         []string
	ContentAvailable bool
}

func StartReindex() bool {
	messageBuffer = make(chan []string)
	contentAvailable = true

	fmt.Println("starting reindex..")

	mSettings := database.GetSettings()

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
			files = append(files, path)
		}
		return nil
	})

	if err != nil {
		fmt.Println(err.Error())
	}
	// start reindex process
	go ReIndexVideos(files, mSettings)

	fmt.Println("finished")
	return true
}

func GetStatusMessage() StatusMessage {
	msg := StatusMessage{
		Messages:         <-messageBuffer,
		ContentAvailable: contentAvailable,
	}

	// reset message buffer
	messageBuffer = make(chan []string)

	return msg
}

func StartCleanup() {
	// todo start cleanup
}
