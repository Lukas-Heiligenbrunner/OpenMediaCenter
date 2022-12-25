import React, {useEffect, useRef} from 'react';
import Hls from 'hls.js';
import {PlyrInstance, PlyrProps, Plyr} from 'plyr-react';
import plyrstyle from 'plyr-react/dist/plyr.css';
import {DefaultPlyrOptions} from '../../types/GeneralTypes';

interface Props {
    // children?: JSX.Element;
    videoid: number;
}

const HLSPlayer = (props: Props): JSX.Element => {
    const ref = useRef(null);
    useEffect(() => {
        const loadVideo = async (): Promise<void> => {
            const video = document.getElementById('plyr') as HTMLVideoElement;
            const hls = new Hls();
            hls.loadSource('/api/video/loadM3U8?id=' + props.videoid);
            hls.attachMedia(video);
            // @ts-ignore
            ref.current!.plyr.media = video;

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                // @ts-ignore
                (ref.current!.plyr as PlyrInstance).play();
            });
        };
        loadVideo();
    });

    return <Plyr style={plyrstyle} options={DefaultPlyrOptions} id='plyr' source={{} as PlyrProps['source']} ref={ref} />;
};

export default HLSPlayer;
