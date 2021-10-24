import React from 'react';
import Preview from '../Preview/Preview';
import {VideoTypes} from '../../types/ApiTypes';
import DynamicContentContainer from '../DynamicContentContainer/DynamicContentContainer';
import {APINode, callAPIPlain} from '../../utils/Api';

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
                    aspectRatio={el.Ratio > 0 ? el.Ratio : undefined}
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
                    linkPath={'/media/player/' + el.MovieId}
                />
            )}
            data={props.data}>
            {props.children}
        </DynamicContentContainer>
    );
};

export default VideoContainer;
