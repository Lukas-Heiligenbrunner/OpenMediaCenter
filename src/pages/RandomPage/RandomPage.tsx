import React from 'react';
import style from './RandomPage.module.css';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import PageTitle from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {TagType} from '../../types/VideoTypes';
import {APINode, VideoTypes} from '../../types/ApiTypes';
import APIComponent from '../../elements/APIComponent';
import KeyComponent from '../../elements/KeyComponent';

interface GetRandomMoviesType {
    Videos: VideoTypes.VideoUnloadedType[];
    Tags: TagType[];
}

/**
 * Randompage shuffles random viedeopreviews and provides a shuffle btn
 */
class RandomPage extends React.Component {
    readonly LoadNR = 3;

    render(): JSX.Element {
        return (
            <div>
                <PageTitle title='Random Videos' subtitle={this.LoadNR + 'pcs'} />
                <APIComponent
                    render={(data: GetRandomMoviesType, actions): JSX.Element => (
                        <KeyComponent listenKey='s' onKey={actions.refresh}>
                            <SideBar>
                                <SideBarTitle>Visible Tags:</SideBarTitle>
                                {data.Tags.map((m) => (
                                    <Tag key={m.TagId} tagInfo={m} />
                                ))}
                            </SideBar>

                            {data.Videos.length !== 0 ? (
                                <VideoContainer data={data.Videos}>
                                    <div className={style.Shufflebutton}>
                                        <button onClick={actions.refresh} className={style.btnshuffle}>
                                            Shuffle
                                        </button>
                                    </div>
                                </VideoContainer>
                            ) : (
                                <div>No Data found!</div>
                            )}
                        </KeyComponent>
                    )}
                    node={APINode.Video}
                    action='getRandomMovies'
                    params={{Number: this.LoadNR}}
                />
            </div>
        );
    }
}

export default RandomPage;
