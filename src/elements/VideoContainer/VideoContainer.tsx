import React from 'react';
import Preview from '../Preview/Preview';
import {VideoTypes} from '../../types/ApiTypes';
import DynamicContentContainer from '../DynamicContentContainer/DynamicContentContainer';

interface Props {
    data: VideoTypes.VideoUnloadedType[];
    children?: JSX.Element;
}

const VideoContainer = (props: Props): JSX.Element => {
    return (
        <DynamicContentContainer
            renderElement={(el): JSX.Element => <Preview key={el.MovieId} name={el.MovieName} movieId={el.MovieId} />}
            data={props.data}>
            {props.children}
        </DynamicContentContainer>
    );
};

export default VideoContainer;
