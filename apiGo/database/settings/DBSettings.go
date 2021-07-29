package settings

import (
	"fmt"
	"openmediacenter/apiGo/database"
)

func GetPassword() *string {
	pwd := LoadSettings().Pasword
	if pwd == "-1" {
		return nil
	} else {
		return &pwd
	}
}

type SettingsType struct {
	DarkMode        bool
	Pasword         string
	MediacenterName string
	VideoPath       string
	TVShowPath      string
}

func LoadSettings() *SettingsType {
	query := "SELECT DarkMode, password, mediacenter_name, video_path, episode_path from settings"

	result := SettingsType{}
	var darkmode uint8

	err := database.QueryRow(query).Scan(&darkmode, &result.Pasword, &result.MediacenterName, &result.VideoPath, &result.TVShowPath)
	if err != nil {
		fmt.Println("error while parsing db data: " + err.Error())
	}

	result.DarkMode = darkmode != 0
	return &result
}
