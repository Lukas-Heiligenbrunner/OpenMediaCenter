package config

import (
	"errors"
	"fmt"
	"github.com/pelletier/go-toml/v2"
	"os"
)

type DatabaseT struct {
	DBName     string
	DBPassword string
	DBUser     string
	DBPort     uint16
	DBHost     string
}

type FileConfT struct {
	Database DatabaseT
}

func defaultConig() *FileConfT {
	return &FileConfT{Database: DatabaseT{
		DBName:     "mediacenter",
		DBPassword: "mediapassword",
		DBUser:     "mediacenteruser",
		DBPort:     3306,
		DBHost:     "127.0.0.1",
	}}
}

var liveConf FileConfT

func Init() {
	cfgname := "openmediacenter.cfg"
	cfgpath := "/etc/"

	// load config from disk
	dat, err := os.ReadFile(cfgpath + cfgname)
	if err != nil {
		// handle error if not exists or no sufficient read access
		if _, ok := err.(*os.PathError); ok {

			// check if config exists on local dir
			dat, err = os.ReadFile(cfgname)
			if err != nil {
				// config really doesn't exist!
				fmt.Printf("config not existing -- generating new empty config at %s%s\n", cfgpath, cfgname)

				// generate new default config
				obj, _ := toml.Marshal(defaultConig())
				liveConf = *defaultConig()

				err := os.WriteFile(cfgpath+cfgname, obj, 777)
				if err != nil {
					if errors.Is(err, os.ErrPermission) {
						// permisson denied to create file try to create at current dir
						err = os.WriteFile(cfgname, obj, 777)
						if err != nil {
							fmt.Println("failed to create default config file!")
						} else {
							fmt.Println("config file created at .")
						}
					} else {
						fmt.Println(err.Error())
					}
				}
			} else {
				// ok decode local config
				decodeConfig(&dat)
			}

		} else {
			// other error
			fmt.Println(err.Error())
		}
	} else {
		decodeConfig(&dat)
	}
}

func decodeConfig(bin *[]byte) {
	config := FileConfT{}

	err := toml.Unmarshal(*bin, &config)
	if err != nil {
		fmt.Println(err)

	} else {
		fmt.Println("Successfully loaded config file!")

		liveConf = config
	}
}

func GetConfig() *FileConfT {
	return &liveConf
}
