package api

import (
	"fmt"
	"io"
	"openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser"
	"os"
)

func addUploadHandler() {
	api.AddHandler("fileupload", api.VideoNode, api.PermUser, func(ctx api.Context) {
		// get path where to store videos to
		mSettings, PathPrefix, _ := database.GetSettings()

		req := ctx.GetRequest()

		mr, err := req.MultipartReader()
		if err != nil {
			ctx.Errorf("incorrect request!")
			return
		}

		videoparser.InitDeps(&mSettings)

		for {
			part, err := mr.NextPart()
			if err == io.EOF {
				break
			}

			// only allow valid extensions
			if !videoparser.ValidVideoSuffix(part.FileName()) {
				continue
			}

			vidpath := PathPrefix + mSettings.VideoPath + part.FileName()
			dst, err := os.OpenFile(vidpath, os.O_WRONLY|os.O_CREATE, 0644)
			if err != nil {
				ctx.Error("error opening file")
				return
			}

			fmt.Printf("Uploading file %s\n", part.FileName())

			// so now loop through every appended file and upload
			buffer := make([]byte, 100000)
			for {
				cBytes, err := part.Read(buffer)
				if cBytes > 0 {
					dst.Write(buffer[0:cBytes])
				}

				if err == io.EOF {
					fmt.Printf("Finished uploading file %s\n", part.FileName())
					go videoparser.ProcessVideo(part.FileName())
					break
				}
			}

			_ = dst.Close()
		}

		ctx.Json(struct {
			Message string
		}{Message: "finished all files"})
	})
}
