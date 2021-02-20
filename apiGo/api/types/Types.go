package types

type VideoUnloadedType struct {
	MovieId   int
	MovieName string
}

type FullVideoType struct {
	MovieName    string
	MovieId      int
	MovieUrl     string
	Poster       string
	Likes        int
	Quality      int
	Length       int
	Tags         []Tag
	SuggestedTag []Tag
	Actors       []Actor
}

type Tag struct {
	TagName string
	TagId   int
}

type Actor struct {
	ActorId   int
	Name      string
	Thumbnail string
}

type StartData struct {
	VideoNr       int
	FullHdNr      int
	HDNr          int
	SDNr          int
	DifferentTags int
	Tagged        int
}

type SettingsType struct {
	VideoPath       string
	EpisodePath     string
	MediacenterName string
	Password        string
	PasswordEnabled bool
	TMDBGrabbing    bool
	DarkMode        bool

	VideoNr       int
	DBSize        float32
	DifferentTags int
	TagsAdded     int

	PathPrefix string
}
