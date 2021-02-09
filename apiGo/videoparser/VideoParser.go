package videoparser

import (
	"fmt"
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

	var files []string
	// todo get path from db
	err := filepath.Walk("/home/lukas/Downloads/", func(path string, info os.FileInfo, err error) error {
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".mp4") {
			files = append(files, path)
		}
		return nil
	})

	fmt.Println(files)

	if err != nil {
		fmt.Println(err.Error())
	}
	// start reindex process
	ReIndexVideos(files)

	fmt.Println("finished")
	return true
}

func GetStatusMessage() StatusMessage {
	msg := StatusMessage{
		Messages:         messageBuffer,
		ContentAvailable: contentAvailable,
	}

	// reset message buffer
	messageBuffer = []string{}

	return msg
}

func StartCleanup() {
	// todo start cleanup
}
