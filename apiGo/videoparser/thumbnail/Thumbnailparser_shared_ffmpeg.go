// +build sharedffmpeg

package thumbnail

import (
	"github.com/3d0c/gmf"
	"io"
	"log"
	"os"
)

func Parse(filename string, time uint64) (*string, *VidInfo, error) {
	dta, inf, err := decodePic(filename, "png", time)
	if len(dta) > 0 && err == nil {
		// base64 encode picture
		enc := EncodeBase64(dta, "image/png")
		return enc, inf, nil
	} else {
		return nil, nil, err
	}
}

func decodePic(srcFileName string, decodeExtension string, time uint64) (pic *[]byte, info *VidInfo, err error) {
	var swsctx *gmf.SwsCtx

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

	codec, err := gmf.FindEncoder(decodeExtension)
	if err != nil {
		log.Printf("%s\n", err)
		return nil, nil, err
	}

	cc := gmf.NewCodecCtx(codec)
	defer gmf.Release(cc)

	cc.SetTimeBase(gmf.AVR{Num: 1, Den: 1})

	cc.SetPixFmt(gmf.AV_PIX_FMT_RGBA).SetWidth(srcVideoStream.CodecPar().Width()).SetHeight(srcVideoStream.CodecPar().Height())
	if codec.IsExperimental() {
		cc.SetStrictCompliance(gmf.FF_COMPLIANCE_EXPERIMENTAL)
	}

	if err := cc.Open(nil); err != nil {
		log.Println(err)
		return nil, nil, err
	}
	defer cc.Free()

	ist, err := inputCtx.GetStream(srcVideoStream.Index())
	if err != nil {
		log.Printf("Error getting stream - %s\n", err)
		return nil, nil, err
	}
	defer ist.Free()

	err = inputCtx.SeekFrameAt(int64(time), 0)
	if err != nil {
		log.Printf("Error while seeking file: %s\n", err.Error())
		return
	}

	// convert source pix_fmt into AV_PIX_FMT_RGBA
	// which is set up by codec context above
	icc := srcVideoStream.CodecCtx()
	if swsctx, err = gmf.NewSwsCtx(icc.Width(), icc.Height(), icc.PixFmt(), cc.Width(), cc.Height(), cc.PixFmt(), gmf.SWS_BICUBIC); err != nil {
		panic(err)
	}
	defer swsctx.Free()

	frameRate := float32(ist.GetRFrameRate().AVR().Num) / float32(ist.GetRFrameRate().AVR().Den)
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

		frames, err = ist.CodecCtx().Decode(pkt)

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

		for i, _ := range frames {
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
		st, _ := inputCtx.GetStream(i)
		st.CodecCtx().Free()
		st.Free()
	}
	return
}
