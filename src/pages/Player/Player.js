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
import GlobalInfos from '../../utils/GlobalInfos';
import {callAPI, getBackendDomain} from '../../utils/Api';


/**
 * Player page loads when a video is selected to play and handles the video view
 * and actions such as tag adding and liking
 */
export class Player extends React.Component{
    options = {
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

    constructor(props, context) {
        super(props, context);

        this.state = {
            sources: null,
            movie_id: null,
            movie_name: null,
            likes: null,
            quality: null,
            length: null,
            tags: [],
            suggesttag: [],
            popupvisible: false,
            actorpopupvisible: false
        };

        this.quickAddTag = this.quickAddTag.bind(this);
    }

    componentDidMount() {
        // initial fetch of current movie data
        this.fetchMovieData();
    }

    /**
     * quick add callback to add tag to db and change gui correctly
     * @param tagId id of tag to add
     * @param tagName name of tag to add
     */
    quickAddTag(tagId, tagName) {
        callAPI('tags.php', {action: 'addTag', id: tagId, movieid: this.props.movie_id}, (result) => {
            if (result.result !== 'success') {
                console.error('error occured while writing to db -- todo error handling');
                console.error(result.result);
            } else {
                // check if tag has already been added
                const tagIndex = this.state.tags.map(function (e) {
                    return e.tag_name;
                }).indexOf(tagName);

                // only add tag if it isn't already there
                if (tagIndex === -1) {
                    // update tags if successful
                    let array = [...this.state.suggesttag]; // make a separate copy of the array (because of setState)
                    const quickaddindex = this.state.suggesttag.map(function (e) {
                        return e.tag_id;
                    }).indexOf(tagId);

                    // check if tag is available in quickadds
                    if (quickaddindex !== -1) {
                        array.splice(quickaddindex, 1);

                        this.setState({
                            tags: [...this.state.tags, {tag_name: tagName}],
                            suggesttag: array
                        });
                    } else {
                        this.setState({
                            tags: [...this.state.tags, {tag_name: tagName}]
                        });
                    }
                }
            }
        });
    }

    /**
     * handle the popovers generated according to state changes
     * @returns {JSX.Element}
     */
    handlePopOvers() {
        return (
            <>
                {this.state.popupvisible ?
                    <AddTagPopup onHide={() => {this.setState({popupvisible: false});}}
                                 submit={this.quickAddTag}
                                 movie_id={this.state.movie_id}/> :
                    null
                }
                {
                    this.state.actorpopupvisible ?
                        <AddActorPopup onHide={() => {
                            this.refetchActors();
                            this.setState({actorpopupvisible: false});
                        }} movie_id={this.state.movie_id}/> : null
                }
            </>
        );
    }

    /**
     * generate sidebar with all items
     */
    assembleSideBar() {
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
                {this.state.tags.map((m) => (
                    <Tag key={m.tag_name}>{m.tag_name}</Tag>
                ))}
                <Line/>
                <SideBarTitle>Tag Quickadd:</SideBarTitle>
                {this.state.suggesttag.map((m) => (
                    <Tag
                        key={m.tag_name}
                        onclick={() => {
                            this.quickAddTag(m.tag_id, m.tag_name);
                        }}>
                        {m.tag_name}
                    </Tag>
                ))}
            </SideBar>
        );
    }

    render() {
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
                        <button className={style.button} style={{backgroundColor: 'green'}} onClick={() => this.likebtn()}>
                            Like this Video!
                        </button>
                        <button className={style.button} style={{backgroundColor: '#3574fe'}} onClick={() => this.setState({popupvisible: true})}>
                            Give this Video a Tag
                        </button>
                        <button className={style.button} style={{backgroundColor: 'red'}} onClick={() => {
                            this.deleteVideo();
                        }}>Delete Video
                        </button>
                    </div>
                    {/* rendering of actor tiles */}
                    <div className={style.actorcontainer}>
                        {this.state.actors ?
                            this.state.actors.map((actr) => (
                                <ActorTile actor={actr}/>
                            )) : <></>
                        }
                        <div className={style.actorAddTile} onClick={() => {
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
                </div>
                <button className={style.closebutton} onClick={() => this.closebtn()}>Close</button>
                {
                    // handle the popovers switched on and off according to state changes
                    this.handlePopOvers()
                }
            </div>
        );
    }

    /**
     * fetch all the required infos of a video from backend
     */
    fetchMovieData() {
        callAPI('video.php', {action: 'loadVideo', movieid: this.props.match.params.id}, result => {
            this.setState({
                sources: {
                    type: 'video',
                    sources: [
                        {
                            src: getBackendDomain() + result.movie_url,
                            type: 'video/mp4',
                            size: 1080
                        }
                    ],
                    poster: result.thumbnail
                },
                movie_id: result.movie_id,
                movie_name: result.movie_name,
                likes: result.likes,
                quality: result.quality,
                length: result.length,
                tags: result.tags,
                suggesttag: result.suggesttag,
                actors: result.actors
            });
            console.log(this.state);
        });
    }


    /**
     * click handler for the like btn
     */
    likebtn() {
        callAPI('video.php', {action: 'addLike', movieid: this.props.movie_id}, result => {
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
    closebtn() {
        this.props.history.goBack();
    }

    /**
     * delete the current video and return to last page
     */
    deleteVideo() {
        callAPI('video.php', {action: 'deleteVideo', movieid: this.props.movie_id}, result => {
            if (result.result === 'success') {
                // return to last element if successful
                GlobalInfos.getViewBinding().returnToLastElement();
            } else {
                console.error('an error occured while liking');
                console.error(result);
            }
        });
    }

    /**
     * show the actor add popup
     */
    addActor() {
        this.setState({actorpopupvisible: true});
    }

    refetchActors() {
        callAPI('actor.php', {action: 'getActorsOfVideo', videoid: this.props.movie_id}, result => {
            this.setState({actors: result});
        });
    }
}

export default withRouter(Player);

