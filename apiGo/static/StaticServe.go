// +build static

package static

import (
	"embed"
	"fmt"
	"io/fs"
	"net/http"
	"net/http/httputil"
	"net/url"
	"openmediacenter/apiGo/database/settings"
	"regexp"
	"strings"
)

//go:embed build
var staticFiles embed.FS

func ServeStaticFiles() {
	// http.FS can be used to create a http Filesystem
	subfs, _ := fs.Sub(staticFiles, "build")
	staticFS := http.FS(subfs)
	fs := http.FileServer(staticFS)

	// Serve static files
	http.Handle("/", validatePrefix(fs))

	// we need to proxy the videopath to somewhere in a standalone binary
	proxyVideoURL()
}

type handler struct {
	proxy *httputil.ReverseProxy
}

func (h handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.proxy.ServeHTTP(w, r)
}

func proxyVideoURL() {
	conf := settings.LoadSettings()

	// match base url
	regexMatchUrl := regexp.MustCompile("^http(|s):\\/\\/([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}\\.([0-9]){1,3}:[0-9]{1,5}")

	var videoUrl *url.URL
	if regexMatchUrl.MatchString(conf.VideoPath) {
		fmt.Println("matches string...")
		var err error
		videoUrl, err = url.Parse(regexMatchUrl.FindString(conf.VideoPath))
		if err != nil {
			panic(err)
		}
	} else {
		videoUrl, _ = url.Parse("http://127.0.0.1:8081")
	}

	director := func(req *http.Request) {
		req.URL.Scheme = videoUrl.Scheme
		req.URL.Host = videoUrl.Host
	}

	serverVideoPath := strings.TrimPrefix(conf.VideoPath, regexMatchUrl.FindString(conf.VideoPath))

	reverseProxy := &httputil.ReverseProxy{Director: director}
	handler := handler{proxy: reverseProxy}
	http.Handle(serverVideoPath, handler)
}

// ValidatePrefix check if requested path is a file -- if not proceed with index.html
func validatePrefix(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		regex := regexp.MustCompile("\\..*$")
		matchFile := regex.MatchString(r.URL.Path)

		if matchFile {
			h.ServeHTTP(w, r)
		} else {
			r2 := new(http.Request)
			*r2 = *r
			r2.URL = new(url.URL)
			*r2.URL = *r.URL
			r2.URL.Path = "/"
			r2.URL.RawPath = "/"
			h.ServeHTTP(w, r2)
		}
	})
}
