package api

import (
	"fmt"
	"io"
	"openmediacenter/apiGo/api/api"
	"openmediacenter/apiGo/database"
	"openmediacenter/apiGo/videoparser"
	"os"
	"path/filepath"
)

func addUploadHandler() {
	api.AddHandler("fileupload", api.VideoNode, api.PermUser, func(ctx api.Context) {
		fmt.Println("we are in file upload handler")
		fmt.Printf("permission: %s\n", ctx.PermID().String())

		// get path where to store videos to
		mSettings, PathPrefix, _ := database.GetSettings()

		req := ctx.GetRequest()

		mr, err := req.MultipartReader()
		if err != nil {
			ctx.Errorf("incorrect request!")
			return
		}

		videoparser.InitDeps(&mSettings)

		//length := req.ContentLength
		for {
			part, err := mr.NextPart()
			if err == io.EOF {
				break
			}

			// todo allow more video formats than mp4
			// only allow valid extensions
			if filepath.Ext(part.FileName()) != ".mp4" {
				continue
			}
			vidpath := PathPrefix + mSettings.VideoPath + part.FileName()
			dst, err := os.OpenFile(vidpath, os.O_WRONLY|os.O_CREATE, 0644)
			if err != nil {
				return
			}

			fmt.Printf("Uploading file %s\n", part.FileName())

			// so now loop through every appended file and upload
			buffer := make([]byte, 100000)
			for {
				cBytes, err := part.Read(buffer)
				if cBytes > 0 {
					//read = read + int64(cBytes)
					//p = float32(read) / float32(length) * 100
					//fmt.Printf("progress: %v \n", p)
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

		ctx.Text("finished all files")
	})
}
