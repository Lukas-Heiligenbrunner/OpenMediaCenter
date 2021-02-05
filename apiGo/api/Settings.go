package api

import (
	"encoding/json"
	"openmediacenter/apiGo/database"
)

func AddSettingsHandlers() {
	AddHandler("loadInitialData", nil, func() []byte {
		query := "SELECT DarkMode, password, mediacenter_name from settings"

		//$result = $this->conn->query($query);
		//
		//$r = mysqli_fetch_assoc($result);
		//
		//$r['passwordEnabled'] = $r['password'] != "-1";
		//unset($r['password']);
		//$r['DarkMode'] = (bool)($r['DarkMode'] != '0');
		//$this->commitMessage(json_encode($r));

		type InitialDataType struct {
			DarkMode         int
			Pasword          int
			Mediacenter_name string
		}

		result := InitialDataType{}

		err := database.QueryRow(query).Scan(&result.DarkMode, &result.Pasword, &result.Mediacenter_name)
		if err != nil {
			panic(err.Error()) // proper error handling instead of panic in your app
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
