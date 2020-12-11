import React from 'react';
import style from './RandomPage.module.css';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import PageTitle from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';

/**
 * Randompage shuffles random viedeopreviews and provides a shuffle btn
 */
class RandomPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            videos: [],
            tags: []
        };
    }

    componentDidMount() {
        this.loadShuffledvideos(4);
    }

    render() {
        return (
            <div>
                <PageTitle title='Random Videos'
                           subtitle='4pc'/>

                <SideBar>
                    <SideBarTitle>Visible Tags:</SideBarTitle>
                    {this.state.tags.map((m) => (
                        <Tag key={m.tag_name}>{m.tag_name}</Tag>
                    ))}
                </SideBar>

                {this.state.videos.length !== 0 ?
                    <VideoContainer
                        data={this.state.videos}>
                        <div className={style.Shufflebutton}>
                            <button onClick={() => this.shuffleclick()} className={style.btnshuffle}>Shuffle</button>
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
    shuffleclick() {
        this.loadShuffledvideos(4);
    }

    /**
     * load random videos from backend
     * @param nr number of videos to load
     */
    loadShuffledvideos(nr) {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getRandomMovies');
        updateRequest.append('number', nr);

        // fetch all videos available
        fetch('/api/video.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    console.log(result);

                    this.setState({videos: []}); // needed to trigger rerender of main videoview
                    this.setState({
                        videos: result.rows,
                        tags: result.tags
                    });
                }))
            .catch(() => {
                console.log('no connection to backend');
            });
    }
}

export default RandomPage;
