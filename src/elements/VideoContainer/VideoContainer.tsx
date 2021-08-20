import React from 'react';
import Preview from '../Preview/Preview';
import {APINode, VideoTypes} from '../../types/ApiTypes';
import DynamicContentContainer from '../DynamicContentContainer/DynamicContentContainer';
import {callAPIPlain} from 'gowebsecure';

interface Props {
    data: VideoTypes.VideoUnloadedType[];
    children?: JSX.Element;
}

const VideoContainer = (props: Props): JSX.Element => {
    return (
        <DynamicContentContainer
            renderElement={(el): JSX.Element => (
                <Preview
                    key={el.MovieId}
                    picLoader={(callback: (pic: string) => void): void => {
                        callAPIPlain(
                            APINode.Video,
                            {
                                action: 'readThumbnail',
                                Movieid: el.MovieId
                            },
                            (result) => callback(result)
                        );
                    }}
                    name={el.MovieName}
                    linkPath={'/player/' + el.MovieId}
                />
            )}
            data={props.data}>
            {props.children}
        </DynamicContentContainer>
    );
};

export default VideoContainer;
