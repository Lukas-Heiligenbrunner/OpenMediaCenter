// +build static

package static

import (
	"embed"
	"io/fs"
	"net/http"
)

//go:embed build
var staticFiles embed.FS

func ServeStaticFiles() {
	// http.FS can be used to create a http Filesystem
	subfs, _ := fs.Sub(staticFiles, "build")
	staticFS := http.FS(subfs)
	fs := http.FileServer(staticFS)

	// Serve static files
	http.Handle("/", fs)
}
