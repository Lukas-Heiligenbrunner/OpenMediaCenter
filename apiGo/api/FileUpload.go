package api

import (
	"fmt"
	"io"
	"openmediacenter/apiGo/api/api"
	"os"
)

func addUploadHandler() {
	api.AddHandler("fileupload", api.VideoNode, api.PermUser, func(ctx api.Context) {
		fmt.Println("we are in file upload handler")
		fmt.Printf("permission: %s\n", ctx.PermID().String())

		req := ctx.GetRequest()

		mr, err := req.MultipartReader()
		if err != nil {
			return
		}
		length := req.ContentLength
		fmt.Println(length)
		for {
			part, err := mr.NextPart()
			if err == io.EOF {
				fmt.Println("part is eof")
				break
			}

			fmt.Println(part.FormName())

			var read int64
			var p float32
			// todo check where we want to place this file
			dst, err := os.OpenFile(part.FileName(), os.O_WRONLY|os.O_CREATE, 0644)
			if err != nil {
				return
			}

			// so now loop through every appended file and upload
			buffer := make([]byte, 100000)
			for {
				cBytes, err := part.Read(buffer)
				if cBytes > 0 {
					read = read + int64(cBytes)
					p = float32(read) / float32(length) * 100
					fmt.Printf("progress: %v \n", p)
					dst.Write(buffer[0:cBytes])
				}

				if err == io.EOF {
					fmt.Println(cBytes)
					fmt.Println("eof this file")
					break
				}
			}

			_ = dst.Close()
		}

		ctx.Text("finished")
	})
}
