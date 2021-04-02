package api

import (
	"encoding/json"
	"openmediacenter/apiGo/database/settings"
	"regexp"
	"strings"
)

func AddInitHandlers() {
	passwordNeeded()
}

func passwordNeeded() {
	AddHandler("loadInitialData", InitNode, nil, func() []byte {
		sett := settings.LoadSettings()

		type InitialDataTypeResponse struct {
			DarkMode        bool
			Pasword         bool
			MediacenterName string
			VideoPath       string
		}

		regexMatchUrl := regexp.MustCompile("^http(|s):\\/\\/([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}:[0-9]{1,5}")
		videoUrl := regexMatchUrl.FindString(sett.VideoPath)
		serverVideoPath := strings.TrimPrefix(sett.VideoPath, videoUrl)

		res := InitialDataTypeResponse{
			DarkMode:        sett.DarkMode,
			Pasword:         sett.Pasword != "-1",
			MediacenterName: sett.Mediacenter_name,
			VideoPath:       serverVideoPath,
		}

		str, _ := json.Marshal(res)
		return str
	})
}
