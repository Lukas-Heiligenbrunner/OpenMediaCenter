package videoparser

import (
	"github.com/fsnotify/fsnotify"
	"log"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"strings"
)

func InitFileWatcher() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal("NewWatcher failed: ", err)
	}

	mSettings, _, _ := database.GetSettings()
	vidFolder := config.GetConfig().General.ReindexPrefix + mSettings.VideoPath
	epsfolder := config.GetConfig().General.ReindexPrefix + mSettings.EpisodePath

	defer watcher.Close()
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				// start new reindex
				// (may be optimized by checking here if added file is video
				// and start reindex just for one file)
				if strings.Contains(event.Name, vidFolder) {
					StartReindex()
				} else if strings.Contains(event.Name, epsfolder) {
					StartTVShowReindex()
				} else {
					log.Printf("Event in wrong folder: %s %s\n", event.Name, event.Op)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}

	}()

	err = watcher.Add(vidFolder)
	if err != nil {
		log.Println("Adding of file watcher failed: ", err)
	}

	err = watcher.Add(epsfolder)
	if err != nil {
		log.Println("Adding of file watcher failed: ", err)
	}
}
