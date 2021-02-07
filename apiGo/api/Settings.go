package api

import (
	"encoding/json"
	"fmt"
	"openmediacenter/apiGo/database"
)

func AddSettingsHandlers() {
	AddHandler("loadInitialData", SettingsNode, nil, func() []byte {
		query := "SELECT DarkMode, password, mediacenter_name from settings"

		type InitialDataType struct {
			DarkMode         int
			Pasword          int
			Mediacenter_name string
		}

		result := InitialDataType{}

		err := database.QueryRow(query).Scan(&result.DarkMode, &result.Pasword, &result.Mediacenter_name)
		if err != nil {
			fmt.Println("error while parsing db data: " + err.Error())
		}

		type InitialDataTypeResponse struct {
			DarkMode         bool
			Pasword          bool
			Mediacenter_name string
		}

		res := InitialDataTypeResponse{
			DarkMode:         result.DarkMode != 0,
			Pasword:          result.Pasword != -1,
			Mediacenter_name: result.Mediacenter_name,
		}

		str, _ := json.Marshal(res)
		return str
	})
}
