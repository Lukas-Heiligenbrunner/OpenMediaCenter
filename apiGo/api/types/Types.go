package types

type VideoUnloadedType struct {
	MovieId   int
	MovieName string
}

type FullVideoType struct {
	MovieName    string
	MovieId      uint32
	MovieUrl     string
	Poster       string
	Likes        uint64
	Quality      uint16
	Length       uint16
	Tags         []Tag
	SuggestedTag []Tag
	Actors       []Actor
}

type Tag struct {
	TagName string
	TagId   uint32
}

type Actor struct {
	ActorId   uint32
	Name      string
	Thumbnail string
}

type StartData struct {
	VideoNr       uint32
	FullHdNr      uint32
	HDNr          uint32
	SDNr          uint32
	DifferentTags uint32
	Tagged        uint32
}

type SettingsType struct {
	VideoPath       string
	EpisodePath     string
	MediacenterName string
	Password        string
	PasswordEnabled bool
	TMDBGrabbing    bool
	DarkMode        bool

	VideoNr       uint32
	DBSize        float32
	DifferentTags uint32
	TagsAdded     uint32

	PathPrefix string
}

type TVShow struct {
	Id   uint32
	Name string
}
