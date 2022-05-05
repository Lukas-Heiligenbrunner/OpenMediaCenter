import React from 'react';
import style from './RandomPage.module.css';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {APINode, callAPI} from '../../utils/Api';
import {TagType} from '../../types/VideoTypes';
import {VideoTypes} from '../../types/ApiTypes';
import {addKeyHandler, removeKeyHandler} from '../../utils/ShortkeyHandler';
import {IconButton} from '../../elements/GPElements/Button';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import AddTagPopup from '../../elements/Popups/AddTagPopup/AddTagPopup';

interface state {
    videos: VideoTypes.VideoUnloadedType[];
    tags: TagType[];
    filterTags: TagType[];
    addTagPopup: boolean;
}

interface GetRandomMoviesType {
    Videos: VideoTypes.VideoUnloadedType[];
    Tags: TagType[];
}

/**
 * Randompage shuffles random viedeopreviews and provides a shuffle btn
 */
class RandomPage extends React.Component<{}, state> {
    readonly LoadNR = 3;

    constructor(props: {}) {
        super(props);

        this.state = {
            addTagPopup: false,
            videos: [],
            tags: [],
            filterTags: []
        };

        this.keypress = this.keypress.bind(this);
    }

    componentDidMount(): void {
        addKeyHandler(this.keypress);

        this.loadShuffledvideos(this.LoadNR);
    }

    componentWillUnmount(): void {
        removeKeyHandler(this.keypress);
    }

    render(): JSX.Element {
        return (
            <div>
                <PageTitle title='Random Videos' subtitle='4pc' />

                <SideBar>
                    <SideBarTitle>Visible Tags:</SideBarTitle>
                    {this.state.tags.map((m) => (
                        <Tag key={m.TagId} tagInfo={m} />
                    ))}
                    <Line />
                    <SideBarTitle>Filter Tags:</SideBarTitle>
                    {this.state.filterTags.map((m) => (
                        <Tag key={m.TagId} tagInfo={m} />
                    ))}
                    <IconButton
                        title='Add'
                        icon={faPlusCircle}
                        onClick={(): void => {
                            this.setState({addTagPopup: true});
                        }}
                    />
                </SideBar>

                {this.state.videos.length !== 0 ? <VideoContainer data={this.state.videos} /> : <div>No Data found!</div>}
                <div className={style.Shufflebutton}>
                    <button onClick={(): void => this.loadShuffledvideos(this.LoadNR)} className={style.btnshuffle}>
                        Shuffle
                    </button>
                </div>
                {this.state.addTagPopup ? (
                    <AddTagPopup
                        onHide={(): void => this.setState({addTagPopup: false})}
                        submit={(tagId: number, tagName: string): void => {
                            this.setState({filterTags: [...this.state.filterTags, {TagId: tagId, TagName: tagName}]}, (): void => {
                                this.loadShuffledvideos(this.LoadNR);
                            });
                        }}
                    />
                ) : null}
            </div>
        );
    }

    /**
     * load random videos from backend
     * @param nr number of videos to load
     */
    loadShuffledvideos(nr: number): void {
        callAPI<GetRandomMoviesType>(
            APINode.Video,
            {action: 'getRandomMovies', Number: nr, TagFilter: this.state.filterTags.map((t) => t.TagId)},
            (result) => {
                this.setState({videos: []}); // needed to trigger rerender of main videoview
                this.setState({
                    videos: result.Videos,
                    tags: result.Tags
                });
            }
        );
    }

    /**
     * key event handling
     * @param event keyevent
     */
    private keypress(event: KeyboardEvent): void {
        // bind s to shuffle
        if (event.key === 's') {
            this.loadShuffledvideos(4);
        }
    }
}

export default RandomPage;
