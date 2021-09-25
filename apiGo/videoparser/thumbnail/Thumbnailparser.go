package thumbnail

import (
	"encoding/base64"
	"fmt"
)

type VidInfo struct {
	Width     uint32
	Height    uint32
	Length    uint64
	FrameRate float32
	Size      int64
}

func EncodeBase64(data *[]byte, mimetype string) *string {
	strEncPic := base64.StdEncoding.EncodeToString(*data)
	backpic64 := fmt.Sprintf("data:%s;base64,%s", mimetype, strEncPic)

	return &backpic64

}
