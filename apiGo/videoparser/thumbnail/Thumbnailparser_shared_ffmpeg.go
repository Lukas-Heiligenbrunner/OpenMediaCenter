// +build sharedffmpeg

package thumbnail

import (
	"fmt"
	"github.com/3d0c/gmf"
	"io"
	"log"
	"os"
)

func Parse(filename string, time uint64) (*string, *VidInfo, error) {
	dta, inf, err := decodePic(filename, "mjpeg", time)
	if err == nil && dta != nil {
		// base64 encode picture
		enc := EncodeBase64(dta, "image/jpeg")
		return enc, inf, nil
	} else {
		return nil, nil, err
	}
}

func decodePic(srcFileName string, encodeExtension string, time uint64) (pic *[]byte, info *VidInfo, err error) {
	var swsctx *gmf.SwsCtx

	gmf.LogSetLevel(gmf.AV_LOG_PANIC)

	stat, err := os.Stat(srcFileName)
	if err != nil {
		// file seems to not even exist
		return nil, nil, err
	}
	fileSize := stat.Size()

	inputCtx, err := gmf.NewInputCtx(srcFileName)

	if err != nil {
		log.Printf("Error creating context - %s\n", err)
		return nil, nil, err
	}
	defer inputCtx.Free()

	srcVideoStream, err := inputCtx.GetBestStream(gmf.AVMEDIA_TYPE_VIDEO)
	if err != nil {
		log.Printf("No video stream found in '%s'\n", srcFileName)
		return nil, nil, err
	}

	encodeCodec, err := gmf.FindEncoder(encodeExtension)
	if err != nil {
		log.Printf("%s\n", err)
		return nil, nil, err
	}

	cc := gmf.NewCodecCtx(encodeCodec)
	defer gmf.Release(cc)

	cc.SetTimeBase(gmf.AVR{Num: 1, Den: 1})

	cc.SetPixFmt(gmf.AV_PIX_FMT_YUVJ444P).SetWidth(srcVideoStream.CodecPar().Width()).SetHeight(srcVideoStream.CodecPar().Height())
	if encodeCodec.IsExperimental() {
		cc.SetStrictCompliance(gmf.FF_COMPLIANCE_EXPERIMENTAL)
	}

	if err := cc.Open(nil); err != nil {
		log.Println(err)
		return nil, nil, err
	}
	defer cc.Free()

	err = inputCtx.SeekFrameAt(int64(time), srcVideoStream.Index())
	if err != nil {
		log.Printf("Error while seeking file: %s\n", err.Error())
		return nil, nil, err
	}

	// find encodeCodec to decode video
	decodeCodec, err := gmf.FindDecoder(srcVideoStream.CodecPar().CodecId())
	if err != nil {
		fmt.Println(err)
		return nil, nil, err
	}

	icc := gmf.NewCodecCtx(decodeCodec)
	defer gmf.Release(icc)

	// copy stream parameters in codeccontext
	err = srcVideoStream.CodecPar().ToContext(icc)
	if err != nil {
		fmt.Println(err.Error())
	}

	// convert source pix_fmt into AV_PIX_FMT_RGBA
	if swsctx, err = gmf.NewSwsCtx(icc.Width(), icc.Height(), icc.PixFmt(), cc.Width(), cc.Height(), cc.PixFmt(), gmf.SWS_BICUBIC); err != nil {
		panic(err)
	}
	defer swsctx.Free()

	frameRate := float32(srcVideoStream.GetRFrameRate().AVR().Num) / float32(srcVideoStream.GetRFrameRate().AVR().Den)
	inf := VidInfo{
		Width:     uint32(icc.Width()),
		Height:    uint32(icc.Height()),
		FrameRate: frameRate,
		Length:    uint64(inputCtx.Duration()),
		Size:      fileSize,
	}

	info = &inf

	var (
		pkt        *gmf.Packet
		frames     []*gmf.Frame
		drain      int = -1
		frameCount int = 0
	)

	for {
		if drain >= 0 {
			break
		}

		pkt, err = inputCtx.GetNextPacket()
		if err != nil && err != io.EOF {
			if pkt != nil {
				pkt.Free()
			}
			log.Printf("error getting next packet - %s", err)
			break
		} else if err != nil && pkt == nil {
			drain = 0
		}

		if pkt != nil && pkt.StreamIndex() != srcVideoStream.Index() {
			continue
		}

		frames, err = srcVideoStream.CodecCtx().Decode(pkt)

		if err != nil {
			log.Printf("Fatal error during decoding - %s\n", err)
			break
		}

		// Decode() method doesn't treat EAGAIN and EOF as errors
		// it returns empty frames slice instead. Countinue until
		// input EOF or frames received.
		if len(frames) == 0 && drain < 0 {
			continue
		}

		if frames, err = gmf.DefaultRescaler(swsctx, frames); err != nil {
			panic(err)
		}

		packets, err := cc.Encode(frames, drain)
		if len(packets) == 0 {
			continue
		}

		if err != nil {
			continue
		}

		picdata := packets[0].Data()
		pic = &picdata

		// cleanup here
		for _, p := range packets {
			p.Free()
		}

		for i := range frames {
			frames[i].Free()
			frameCount++
		}

		if pkt != nil {
			pkt.Free()
			pkt = nil
		}

		// we only want to encode first picture then exit
		break
	}

	for i := 0; i < inputCtx.StreamsCnt(); i++ {
		st, err := inputCtx.GetStream(i)
		if err == nil && st != nil {
			st.Free()
		}
	}

	icc.Free()
	srcVideoStream.Free()

	return
}
