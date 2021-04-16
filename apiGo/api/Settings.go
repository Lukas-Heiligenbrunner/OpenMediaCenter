package api

import (
	"encoding/json"
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
	AddHandler("loadGeneralSettings", SettingsNode, nil, func() []byte {
		result := database.GetSettings()
		return jsonify(result)
	})
	AddHandler("loadInitialData", SettingsNode, nil, func() []byte {
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
	var sgs struct {
		Settings types.SettingsType
	}
	AddHandler("saveGeneralSettings", SettingsNode, &sgs, func() []byte {
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
			sgs.Settings.VideoPath, sgs.Settings.EpisodePath, sgs.Settings.Password,
			sgs.Settings.MediacenterName, sgs.Settings.TMDBGrabbing, sgs.Settings.DarkMode)
	})
}

// methods for handling reindexing and cleanup of db gravity
func reIndexHandling() {
	AddHandler("startReindex", SettingsNode, nil, func() []byte {
		videoparser.StartReindex()
		return database.ManualSuccessResponse(nil)
	})

	AddHandler("startTVShowReindex", SettingsNode, nil, func() []byte {
		videoparser.StartTVShowReindex()
		return database.ManualSuccessResponse(nil)
	})

	AddHandler("cleanupGravity", SettingsNode, nil, func() []byte {
		videoparser.StartCleanup()
		return nil
	})

	AddHandler("getStatusMessage", SettingsNode, nil, func() []byte {
		return jsonify(videoparser.GetStatusMessage())
	})
}
