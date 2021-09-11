package config

import (
	"errors"
	"flag"
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

type FeaturesT struct {
	DisableTVSupport     bool
	FullyDeletableVideos bool
}

type GeneralT struct {
	VerboseLogging bool
	ReindexPrefix  string
}

type FileConfT struct {
	Database DatabaseT
	General  GeneralT
	Features FeaturesT
}

func defaultConfig() *FileConfT {
	return &FileConfT{
		Database: DatabaseT{
			DBName:     "mediacenter",
			DBPassword: "mediapassword",
			DBUser:     "mediacenteruser",
			DBPort:     3306,
			DBHost:     "127.0.0.1",
		},
		General: GeneralT{
			VerboseLogging: false,
			ReindexPrefix:  "/var/www/openmediacenter",
		},
		Features: FeaturesT{
			DisableTVSupport:     false,
			FullyDeletableVideos: false,
		},
	}
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
				generateNewConfig(cfgpath, cfgname)
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

	handleCommandLineArguments()
}

func generateNewConfig(cfgpath string, cfgname string) {
	// config really doesn't exist!
	fmt.Printf("config not existing -- generating new empty config at %s%s\n", cfgpath, cfgname)

	// generate new default config
	obj, _ := toml.Marshal(defaultConfig())
	liveConf = *defaultConfig()

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
}

func decodeConfig(bin *[]byte) {
	config := FileConfT{}

	err := toml.Unmarshal(*bin, &config)
	if err != nil {
		fmt.Println(err)
		liveConf = *defaultConfig()
	} else {
		fmt.Println("Successfully loaded config file!")

		liveConf = config
	}
}

// handleCommandLineArguments let cli args override the config
func handleCommandLineArguments() {
	// get a defaultconfig obj to set defaults
	dconf := defaultConfig()

	const (
		DBHost               = "DBHost"
		DBPort               = "DBPort"
		DBUser               = "DBUser"
		DBPassword           = "DBPassword"
		DBName               = "DBName"
		Verbose              = "v"
		ReindexPrefix        = "ReindexPrefix"
		DisableTVSupport     = "DisableTVSupport"
		FullyDeletableVideos = "FullyDeletableVideos"
	)

	dbhostPtr := flag.String(DBHost, dconf.Database.DBHost, "database host name")
	dbPortPtr := flag.Int(DBPort, int(dconf.Database.DBPort), "database port")
	dbUserPtr := flag.String(DBUser, dconf.Database.DBUser, "database username")
	dbPassPtr := flag.String(DBPassword, dconf.Database.DBPassword, "database username")
	dbNamePtr := flag.String(DBName, dconf.Database.DBName, "database name")

	verbosePtr := flag.Bool(Verbose, dconf.General.VerboseLogging, "Verbose log output")

	pathPrefix := flag.String(ReindexPrefix, dconf.General.ReindexPrefix, "Prefix path for videos to reindex")

	disableTVShowSupport := flag.Bool(DisableTVSupport, dconf.Features.DisableTVSupport, "Disable the TVShow support and pages")
	videosFullyDeletable := flag.Bool(FullyDeletableVideos, dconf.Features.FullyDeletableVideos, "Allow deletion from harddisk")

	flag.Parse()

	if isFlagPassed(DBHost) {
		liveConf.Database.DBHost = *dbhostPtr
	}

	if isFlagPassed(DBPort) {
		liveConf.Database.DBPort = uint16(*dbPortPtr)
	}

	if isFlagPassed(DBName) {
		liveConf.Database.DBName = *dbNamePtr
	}

	if isFlagPassed(DBUser) {
		liveConf.Database.DBUser = *dbUserPtr
	}

	if isFlagPassed(DBPassword) {
		liveConf.Database.DBPassword = *dbPassPtr
	}

	if isFlagPassed(Verbose) {
		liveConf.General.VerboseLogging = *verbosePtr
	}

	if isFlagPassed(ReindexPrefix) {
		liveConf.General.ReindexPrefix = *pathPrefix
	}

	if isFlagPassed(DisableTVSupport) {
		liveConf.Features.DisableTVSupport = *disableTVShowSupport
	}

	if isFlagPassed(FullyDeletableVideos) {
		liveConf.Features.FullyDeletableVideos = *videosFullyDeletable
	}
}

// isFlagPassed check whether a flag was passed
func isFlagPassed(name string) bool {
	found := false
	flag.Visit(func(f *flag.Flag) {
		if f.Name == name {
			found = true
		}
	})
	return found
}

func GetConfig() *FileConfT {
	return &liveConf
}
