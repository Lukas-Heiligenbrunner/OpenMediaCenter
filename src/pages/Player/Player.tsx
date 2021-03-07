import React from 'react';

import style from './Player.module.css';
import plyrstyle from 'plyr-react/dist/plyr.css';

import {Plyr} from 'plyr-react';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import AddTagPopup from '../../elements/Popups/AddTagPopup/AddTagPopup';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import AddActorPopup from '../../elements/Popups/AddActorPopup/AddActorPopup';
import ActorTile from '../../elements/ActorTile/ActorTile';
import {withRouter} from 'react-router-dom';
import {APINode, callAPI, getBackendDomain} from '../../utils/Api';
import {RouteComponentProps} from 'react-router';
import {GeneralSuccess} from '../../types/GeneralTypes';
import {ActorType, TagType} from '../../types/VideoTypes';
import PlyrJS from 'plyr';
import {Button} from '../../elements/GPElements/Button';
import {VideoTypes} from '../../types/ApiTypes';
import GlobalInfos from "../../utils/GlobalInfos";

interface myprops extends RouteComponentProps<{ id: string }> {}

interface mystate {
    sources?: PlyrJS.SourceInfo,
    movie_id: number,
    movie_name: string,
    likes: number,
    quality: number,
    length: number,
    tags: TagType[],
    suggesttag: TagType[],
    popupvisible: boolean,
    actorpopupvisible: boolean,
    actors: ActorType[]
}

/**
 * Player page loads when a video is selected to play and handles the video view
 * and actions such as tag adding and liking
 */
export class Player extends React.Component<myprops, mystate> {
    options: PlyrJS.Options = {
        controls: [
            'play-large', // The large play button in the center
            'play', // Play/pause playback
            'progress', // The progress bar and scrubber for playback and buffering
            'current-time', // The current time of playback
            'duration', // The full duration of the media
            'mute', // Toggle mute
            'volume', // Volume control
            'captions', // Toggle captions
            'settings', // Settings menu
            'airplay', // Airplay (currently Safari only)
            'download', // Show a download button with a link to either the current source or a custom URL you specify in your options
            'fullscreen' // Toggle fullscreen
        ]
    };

    constructor(props: myprops) {
        super(props);

        this.state = {
            movie_id: -1,
            movie_name: '',
            likes: 0,
            quality: 0,
            length: 0,
            tags: [],
            suggesttag: [],
            popupvisible: false,
            actorpopupvisible: false,
            actors: []
        };

        this.quickAddTag = this.quickAddTag.bind(this);
    }

    componentDidMount(): void {
        // initial fetch of current movie data
        this.fetchMovieData();
    }

    render(): JSX.Element {
        return (
            <div id='videocontainer'>
                <PageTitle
                    title='Watch'
                    subtitle={this.state.movie_name}/>

                {this.assembleSideBar()}

                <div className={style.videowrapper}>
                    {/* video component is added here */}
                    {this.state.sources ? <Plyr
                            style={plyrstyle}
                            source={this.state.sources}
                            options={this.options}/> :
                        <div>not loaded yet</div>}
                    <div className={style.videoactions}>
                        <Button onClick={(): void => this.likebtn()} title='Like this Video!' color={{backgroundColor: 'green'}}/>
                        <Button onClick={(): void => this.setState({popupvisible: true})} title='Give this Video a Tag' color={{backgroundColor: '#3574fe'}}/>
                        <Button title='Delete Video' onClick={(): void => {this.deleteVideo();}} color={{backgroundColor: 'red'}}/>
                    </div>
                    {this.assembleActorTiles()}
                </div>
                <button className={style.closebutton} onClick={(): void => this.closebtn()}>Close</button>
                {
                    // handle the popovers switched on and off according to state changes
                    this.handlePopOvers()
                }
            </div>
        );
    }

    /**
     * generate sidebar with all items
     */
    assembleSideBar(): JSX.Element {
        return (
            <SideBar>
                <SideBarTitle>Infos:</SideBarTitle>
                <Line/>
                <SideBarItem><b>{this.state.likes}</b> Likes!</SideBarItem>
                {this.state.quality !== 0 ?
                    <SideBarItem><b>{this.state.quality}p</b> Quality!</SideBarItem> : null}
                {this.state.length !== 0 ?
                    <SideBarItem><b>{Math.round(this.state.length / 60)}</b> Minutes of length!</SideBarItem> : null}
                <Line/>
                <SideBarTitle>Tags:</SideBarTitle>
                {this.state.tags.map((m: TagType) => (
                    <Tag key={m.TagId} tagInfo={m}/>
                ))}
                <Line/>
                <SideBarTitle>Tag Quickadd:</SideBarTitle>
                {this.state.suggesttag.map((m: TagType) => (
                    <Tag
                        tagInfo={m}
                        key={m.TagName}
                        onclick={(): void => {
                            this.quickAddTag(m.TagId, m.TagName);
                        }}/>
                ))}
            </SideBar>
        );
    }

    /**
     * rendering of actor tiles
     */
    private assembleActorTiles(): JSX.Element {
        return (
            <div className={style.actorcontainer}>
                {this.state.actors ?
                    this.state.actors.map((actr: ActorType) => (
                        <ActorTile key={actr.ActorId} actor={actr}/>
                    )) : <></>
                }
                <div className={style.actorAddTile} onClick={(): void => {
                    this.addActor();
                }}>
                    <div className={style.actorAddTile_thumbnail}>
                        <FontAwesomeIcon style={{
                            lineHeight: '130px'
                        }} icon={faPlusCircle} size='5x'/>
                    </div>
                    <div className={style.actorAddTile_name}>Add Actor</div>
                </div>
            </div>
        );
    }


    /**
     * handle the popovers generated according to state changes
     * @returns {JSX.Element}
     */
    handlePopOvers(): JSX.Element {
        return (
            <>
                {this.state.popupvisible ?
                    <AddTagPopup onHide={(): void => {
                        this.setState({popupvisible: false});
                    }}
                                 submit={this.quickAddTag}
                                 movie_id={this.state.movie_id}/> :
                    null
                }
                {
                    this.state.actorpopupvisible ?
                        <AddActorPopup onHide={(): void => {
                            this.refetchActors();
                            this.setState({actorpopupvisible: false});
                        }} movie_id={this.state.movie_id}/> : null
                }
            </>
        );
    }

    /**
     * quick add callback to add tag to db and change gui correctly
     * @param tagId id of tag to add
     * @param tagName name of tag to add
     */
    quickAddTag(tagId: number, tagName: string): void {
        callAPI(APINode.Tags, {
            action: 'addTag',
            TagId: tagId,
            MovieId: parseInt(this.props.match.params.id)
        }, (result: GeneralSuccess) => {
            if (result.result !== 'success') {
                console.error('error occured while writing to db -- todo error handling');
                console.error(result.result);
            } else {
                // check if tag has already been added
                const tagIndex = this.state.tags.map(function (e: TagType) {
                    return e.TagName;
                }).indexOf(tagName);

                // only add tag if it isn't already there
                if (tagIndex === -1) {
                    // update tags if successful
                    let array = [...this.state.suggesttag]; // make a separate copy of the array (because of setState)
                    const quickaddindex = this.state.suggesttag.map(function (e: TagType) {
                        return e.TagId;
                    }).indexOf(tagId);

                    // check if tag is available in quickadds
                    if (quickaddindex !== -1) {
                        array.splice(quickaddindex, 1);

                        this.setState({
                            tags: [...this.state.tags, {TagName: tagName, TagId: tagId}],
                            suggesttag: array
                        });
                    } else {
                        this.setState({
                            tags: [...this.state.tags, {TagName: tagName, TagId: tagId}]
                        });
                    }
                }
            }
        });
    }

    /**
     * fetch all the required infos of a video from backend
     */
    fetchMovieData(): void {
        callAPI(APINode.Video, {action: 'loadVideo', MovieId: parseInt(this.props.match.params.id)}, (result: VideoTypes.loadVideoType) => {
            console.log(result)
            this.setState({
                sources: {
                    type: 'video',
                    sources: [
                        {
                            src: getBackendDomain() + GlobalInfos.getVideoPath() + result.MovieUrl,
                            type: 'video/mp4',
                            size: 1080
                        }
                    ],
                    poster: result.Poster
                },
                movie_id: result.MovieId,
                movie_name: result.MovieName,
                likes: result.Likes,
                quality: result.Quality,
                length: result.Length,
                tags: result.Tags,
                suggesttag: result.SuggestedTag,
                actors: result.Actors
            });
        });
    }


    /**
     * click handler for the like btn
     */
    likebtn(): void {
        callAPI(APINode.Video, {action: 'addLike', MovieId: parseInt(this.props.match.params.id)}, (result: GeneralSuccess) => {
            if (result.result === 'success') {
                // likes +1 --> avoid reload of all data
                this.setState({likes: this.state.likes + 1});
            } else {
                console.error('an error occured while liking');
                console.error(result);
            }
        });
    }

    /**
     * closebtn click handler
     * calls callback to viewbinding to show previous page agains
     */
    closebtn(): void {
        this.props.history.goBack();
    }

    /**
     * delete the current video and return to last page
     */
    deleteVideo(): void {
        callAPI(APINode.Video, {action: 'deleteVideo', MovieId: parseInt(this.props.match.params.id)}, (result: GeneralSuccess) => {
            if (result.result === 'success') {
                // return to last element if successful
                this.props.history.goBack();
            } else {
                console.error('an error occured while liking');
                console.error(result);
            }
        });
    }

    /**
     * show the actor add popup
     */
    addActor(): void {
        this.setState({actorpopupvisible: true});
    }

    /**
     * fetch the available video actors again
     */
    refetchActors(): void {
        callAPI<ActorType[]>(APINode.Actor, {action: 'getActorsOfVideo', MovieId: parseInt(this.props.match.params.id)}, result => {
            this.setState({actors: result});
        });
    }
}

export default withRouter(Player);

