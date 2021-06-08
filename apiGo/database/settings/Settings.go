package settings

var tvShowEnabled bool

func TVShowsEnabled() bool {
	return tvShowEnabled
}

func SetTVShowEnabled(enabled bool) {
	tvShowEnabled = enabled
}
