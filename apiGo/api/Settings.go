package api

import (
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser"
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

	AddHandler("cleanupGravity", SettingsNode, nil, func() []byte {
		videoparser.StartCleanup()
		return nil
	})

	AddHandler("getStatusMessage", SettingsNode, nil, func() []byte {
		return jsonify(videoparser.GetStatusMessage())
	})
}
