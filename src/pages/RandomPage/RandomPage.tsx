import React from 'react';
import style from './RandomPage.module.css';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import PageTitle from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {callAPI} from '../../utils/Api';
import {TagType} from '../../types/VideoTypes';
import {VideoTypes} from '../../types/ApiTypes';

interface state {
    videos: VideoTypes.VideoUnloadedType[];
    tags: TagType[];
}

interface GetRandomMoviesType {
    rows: VideoTypes.VideoUnloadedType[];
    tags: TagType[];
}

/**
 * Randompage shuffles random viedeopreviews and provides a shuffle btn
 */
class RandomPage extends React.Component<{}, state> {
    constructor(props: {}) {
        super(props);

        this.state = {
            videos: [],
            tags: []
        };
    }

    componentDidMount(): void {
        this.loadShuffledvideos(4);
    }

    render(): JSX.Element {
        return (
            <div>
                <PageTitle title='Random Videos'
                           subtitle='4pc'/>

                <SideBar>
                    <SideBarTitle>Visible Tags:</SideBarTitle>
                    {this.state.tags.map((m) => (
                        <Tag key={m.tag_id} tagInfo={m}/>
                    ))}
                </SideBar>

                {this.state.videos.length !== 0 ?
                    <VideoContainer
                        data={this.state.videos}>
                        <div className={style.Shufflebutton}>
                            <button onClick={(): void => this.shuffleclick()} className={style.btnshuffle}>Shuffle</button>
                        </div>
                    </VideoContainer>
                    :
                    <div>No Data found!</div>}

            </div>
        );
    }

    /**
     * click handler for shuffle btn
     */
    shuffleclick(): void {
        this.loadShuffledvideos(4);
    }

    /**
     * load random videos from backend
     * @param nr number of videos to load
     */
    loadShuffledvideos(nr: number): void {
        callAPI<GetRandomMoviesType>('video.php', {action: 'getRandomMovies', number: nr}, result => {
            console.log(result);

            this.setState({videos: []}); // needed to trigger rerender of main videoview
            this.setState({
                videos: result.rows,
                tags: result.tags
            });
        });
    }
}

export default RandomPage;
