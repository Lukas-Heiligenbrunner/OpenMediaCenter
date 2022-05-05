package api

import (
	"openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/api/types"
	"openmediacenter/apiGo/config"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/database/settings"
	"openmediacenter/apiGo/videoparser"
	"regexp"
	"strings"
)

func addSettingsHandlers() {
	saveSettingsToDB()
	getSettingsFromDB()
	reIndexHandling()
}

func getSettingsFromDB() {
	/**
	 * @api {post} /api/settings [loadGeneralSettings]
	 * @apiDescription Get the settings object
	 * @apiName loadGeneralSettings
	 * @apiGroup Settings
	 *
	 * @apiSuccess {Object} Settings Settings object
	 * @apiSuccess {string} Settings.VideoPath webserver path to the videos
	 * @apiSuccess {string} Settings.EpisodePath webserver path to the tvshows
	 * @apiSuccess {string} Settings.MediacenterName overall name of the mediacenter
	 * @apiSuccess {string} Settings.Password new server password (-1 if no password set)
	 * @apiSuccess {bool} Settings.TMDBGrabbing TMDB grabbing support to grab tag info and thumbnails
	 * @apiSuccess {bool} Settings.DarkMode Darkmode enabled?
	 * @apiSuccess {Object} Sizes Sizes object
	 * @apiSuccess {uint32} Sizes.VideoNr total number of videos
	 * @apiSuccess {float32} Sizes.DBSize total size of database
	 * @apiSuccess {uint32} Sizes.DifferentTags number of different tags available
	 * @apiSuccess {uint32} Sizes.TagsAdded number of different tags added to videos
	 */
	api.AddHandler("loadGeneralSettings", api.SettingsNode, api.PermUser, func(context api.Context) {
		result, _, sizes := database.GetSettings()

		var ret = struct {
			Settings *types.SettingsType
			Sizes    *types.SettingsSizeType
		}{
			Settings: &result,
			Sizes:    &sizes,
		}
		context.Json(ret)
	})

	/**
	 * @api {post} /api/settings [loadInitialData]
	 * @apiDescription load startdata to display on homepage
	 * @apiName loadInitialData
	 * @apiGroup Settings
	 *
	 * @apiSuccess {string} VideoPath webserver path to the videos
	 * @apiSuccess {string} EpisodePath webserver path to the tvshows
	 * @apiSuccess {string} MediacenterName overall name of the mediacenter
	 * @apiSuccess {string} Pasword new server password (-1 if no password set)
	 * @apiSuccess {bool} DarkMode Darkmode enabled?
	 * @apiSuccess {bool} TVShowEnabled is are TVShows enabled
	 */
	api.AddHandler("loadInitialData", api.SettingsNode, api.PermUser, func(context api.Context) {
		sett := settings.LoadSettings()

		type InitialDataTypeResponse struct {
			DarkMode          bool
			Pasword           bool
			MediacenterName   string
			VideoPath         string
			TVShowPath        string
			TVShowEnabled     bool
			FullDeleteEnabled bool
			RandomNR          uint32
		}

		regexMatchUrl := regexp.MustCompile("^http(|s)://([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}:[0-9]{1,5}")
		videoUrl := regexMatchUrl.FindString(sett.VideoPath)
		tvshowurl := regexMatchUrl.FindString(sett.TVShowPath)
		serverVideoPath := strings.TrimPrefix(sett.VideoPath, videoUrl)
		serverTVShowPath := strings.TrimPrefix(sett.TVShowPath, tvshowurl)

		res := InitialDataTypeResponse{
			DarkMode:          sett.DarkMode,
			Pasword:           sett.Pasword != "-1",
			MediacenterName:   sett.MediacenterName,
			VideoPath:         serverVideoPath,
			TVShowPath:        serverTVShowPath,
			TVShowEnabled:     !config.GetConfig().Features.DisableTVSupport,
			FullDeleteEnabled: config.GetConfig().Features.FullyDeletableVideos,
			RandomNR:          sett.RandomNR,
		}

		context.Json(res)
	})
}

func saveSettingsToDB() {
	/**
	 * @api {post} /api/settings [saveGeneralSettings]
	 * @apiDescription Save the global settings provided
	 * @apiName saveGeneralSettings
	 * @apiGroup Settings
	 *
	 * @apiParam {string} VideoPath webserver path to the videos
	 * @apiParam {string} EpisodePath webserver path to the tvshows
	 * @apiParam {string} MediacenterName overall name of the mediacenter
	 * @apiParam {string} Password new server password (-1 if no password set)
	 * @apiParam {bool} TMDBGrabbing TMDB grabbing support to grab tag info and thumbnails
	 * @apiParam {bool} DarkMode Darkmode enabled?
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("saveGeneralSettings", api.SettingsNode, api.PermUser, func(context api.Context) {
		var args types.SettingsType
		err := api.DecodeRequest(context.GetRequest(), &args)
		if err != nil {
			context.Error("unable to decode arguments")
			return
		}

		query := `
					UPDATE settings SET 
                        video_path=?,
                        episode_path=?,
                        password=?,
                        mediacenter_name=?,
                        TMDB_grabbing=?, 
                        DarkMode=?,
						random_nr=?
                    WHERE 1`
		// todo avoid conversion
		context.Text(string(database.SuccessQuery(query,
			args.VideoPath, args.EpisodePath, args.Password,
			args.MediacenterName, args.TMDBGrabbing, args.DarkMode, args.RandomNR)))
	})
}

// methods for handling reindexing and cleanup of db gravity
func reIndexHandling() {
	/**
	 * @api {post} /api/settings [startReindex]
	 * @apiDescription Start Database video reindex Job
	 * @apiName startReindex
	 * @apiGroup Settings
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("startReindex", api.SettingsNode, api.PermUser, func(context api.Context) {
		videoparser.StartReindex()
		context.Text(string(database.ManualSuccessResponse(nil)))
	})

	/**
	 * @api {post} /api/settings [startTVShowReindex]
	 * @apiDescription Start Database TVShow reindex job
	 * @apiName startTVShowReindex
	 * @apiGroup Settings
	 *
	 * @apiSuccess {string} result 'success' if successfully or Error message if not
	 */
	api.AddHandler("startTVShowReindex", api.SettingsNode, api.PermUser, func(context api.Context) {
		videoparser.StartTVShowReindex()
		context.Text(string(database.ManualSuccessResponse(nil)))
	})

	/**
	 * @api {post} /api/settings [cleanupGravity]
	 * @apiDescription Start Database cleanup job
	 * @apiName cleanupGravity
	 * @apiGroup Settings
	 */
	api.AddHandler("cleanupGravity", api.SettingsNode, api.PermUser, func(context api.Context) {
		videoparser.StartCleanup()
	})
}
