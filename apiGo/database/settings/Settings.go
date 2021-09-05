package settings

var tvShowEnabled bool
var videosDeletable bool

func TVShowsEnabled() bool {
	return tvShowEnabled
}

func SetTVShowEnabled(enabled bool) {
	tvShowEnabled = enabled
}

func VideosDeletable() bool {
	return videosDeletable
}

func SetVideosDeletable(deletable bool) {
	videosDeletable = deletable
}
