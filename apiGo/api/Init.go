package api

import (
	"encoding/json"
	"openmediacenter/apiGo/database/settings"
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

		res := InitialDataTypeResponse{
			DarkMode:        sett.DarkMode,
			Pasword:         sett.Pasword != "-1",
			MediacenterName: sett.Mediacenter_name,
			VideoPath:       sett.VideoPath,
		}

		str, _ := json.Marshal(res)
		return str
	})
}
