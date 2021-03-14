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
	DarkMode         bool
	Pasword          string
	Mediacenter_name string
	VideoPath        string
}

func LoadSettings() *SettingsType {
	query := "SELECT DarkMode, password, mediacenter_name, video_path from settings"

	type RawSettingsType struct {
		DarkMode         int
		Pasword          string
		Mediacenter_name string
		VideoPath        string
	}

	result := RawSettingsType{}

	err := database.QueryRow(query).Scan(&result.DarkMode, &result.Pasword, &result.Mediacenter_name, &result.VideoPath)
	if err != nil {
		fmt.Println("error while parsing db data: " + err.Error())
	}

	res := SettingsType{
		DarkMode:         result.DarkMode != 0,
		Pasword:          result.Pasword,
		Mediacenter_name: result.Mediacenter_name,
		VideoPath:        result.VideoPath,
	}

	return &res
}
