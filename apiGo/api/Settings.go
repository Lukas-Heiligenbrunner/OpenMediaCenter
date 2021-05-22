package api

import (
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/database/settings"
	"openmediacenter/apiGo/videoparser"
	"regexp"
	"strings"
)

func AddSettingsHandlers() {
	saveSettingsToDB()
	getSettingsFromDB()
	reIndexHandling()
}

func getSettingsFromDB() {
	AddHandler("loadGeneralSettings", SettingsNode, func(info *HandlerInfo) []byte {
		result := database.GetSettings()
		return jsonify(result)
	})

	AddHandler("loadInitialData", SettingsNode, func(info *HandlerInfo) []byte {
		sett := settings.LoadSettings()

		type InitialDataTypeResponse struct {
			DarkMode        bool
			Pasword         bool
			MediacenterName string
			VideoPath       string
			TVShowPath      string
		}

		regexMatchUrl := regexp.MustCompile("^http(|s)://([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}:[0-9]{1,5}")
		videoUrl := regexMatchUrl.FindString(sett.VideoPath)
		tvshowurl := regexMatchUrl.FindString(sett.TVShowPath)
		serverVideoPath := strings.TrimPrefix(sett.VideoPath, videoUrl)
		serverTVShowPath := strings.TrimPrefix(sett.TVShowPath, tvshowurl)

		res := InitialDataTypeResponse{
			DarkMode:        sett.DarkMode,
			Pasword:         sett.Pasword != "-1",
			MediacenterName: sett.MediacenterName,
			VideoPath:       serverVideoPath,
			TVShowPath:      serverTVShowPath,
		}

		str, _ := json.Marshal(res)
		return str
	})
}

func saveSettingsToDB() {
	AddHandler("saveGeneralSettings", SettingsNode, func(info *HandlerInfo) []byte {
		var args struct {
			Settings types.SettingsType
		}
		if err := FillStruct(&args, info.Data); err != nil {
			fmt.Println(err.Error())
			return nil
		}

		query := `
					UPDATE settings SET 
                        video_path=?,
                        episode_path=?,
                        password=?,
                        mediacenter_name=?,
                        TMDB_grabbing=?, 
                        DarkMode=?
                    WHERE 1`
		return database.SuccessQuery(query,
			args.Settings.VideoPath, args.Settings.EpisodePath, args.Settings.Password,
			args.Settings.MediacenterName, args.Settings.TMDBGrabbing, args.Settings.DarkMode)
	})
}

// methods for handling reindexing and cleanup of db gravity
func reIndexHandling() {
	AddHandler("startReindex", SettingsNode, func(info *HandlerInfo) []byte {
		videoparser.StartReindex()
		return database.ManualSuccessResponse(nil)
	})

	AddHandler("startTVShowReindex", SettingsNode, func(info *HandlerInfo) []byte {
		videoparser.StartTVShowReindex()
		return database.ManualSuccessResponse(nil)
	})

	AddHandler("cleanupGravity", SettingsNode, func(info *HandlerInfo) []byte {
		videoparser.StartCleanup()
		return nil
	})
}
