import React from 'react';
import style from './Player.module.css';

import {PlyrComponent} from 'plyr-react';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import AddTagPopup from '../../elements/AddTagPopup/AddTagPopup';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';


/**
 * Player page loads when a video is selected to play and handles the video view
 * and actions such as tag adding and liking
 */
class Player extends React.Component {
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
            popupvisible: false
        };

        this.quickAddTag = this.quickAddTag.bind(this);
    }

    componentDidMount() {
        this.fetchMovieData();
    }

    /**
     * quick add callback to add tag to db and change gui correctly
     * @param tag_id id of tag to add
     * @param tag_name name of tag to add
     */
    quickAddTag(tag_id, tag_name) {
        const updateRequest = new FormData();
        updateRequest.append('action', 'addTag');
        updateRequest.append('id', tag_id);
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.result !== 'success') {
                        console.error('error occured while writing to db -- todo error handling');
                        console.error(result.result);
                    } else {
                        // check if tag has already been added
                        const tagindwx = this.state.tags.map(function (e) {
                            return e.tag_name;
                        }).indexOf(tag_name);

                        // only add tag if it isn't already there
                        if (tagindwx === -1) {
                            // update tags if successful
                            let array = [...this.state.suggesttag]; // make a separate copy of the array (because of setState)
                            const quickaddindex = this.state.suggesttag.map(function (e) {
                                return e.tag_id;
                            }).indexOf(tag_id);

                            // check if tag is available in quickadds
                            if (quickaddindex !== -1) {
                                array.splice(quickaddindex, 1);

                                this.setState({
                                    tags: [...this.state.tags, {tag_name: tag_name}],
                                    suggesttag: array
                                });
                            } else {
                                this.setState({
                                    tags: [...this.state.tags, {tag_name: tag_name}]
                                });
                            }
                        }
                    }
                }));
    }

    /**
     * handle the popovers generated according to state changes
     * @returns {JSX.Element}
     */
    handlePopOvers() {
        return (
            <>
                {this.state.popupvisible ?
                    <AddTagPopup show={this.state.popupvisible}
                                 onHide={() => {
                                     this.setState({popupvisible: false});
                                 }}
                                 submit={this.quickAddTag}
                                 movie_id={this.state.movie_id}/> :
                    null
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
                    <SideBarItem><b>{Math.round(this.state.length / 60)}</b> Minutes of
                                                                             length!</SideBarItem> : null}
                <Line/>
                <SideBarTitle>Tags:</SideBarTitle>
                {this.state.tags.map((m) => (
                    <Tag
                        key={m.tag_name}
                        viewbinding={this.props.viewbinding}>{m.tag_name}</Tag>
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
                    {this.state.sources ? <PlyrComponent
                            className='myvideo'
                            sources={this.state.sources}
                            options={this.options}/> :
                        <div>not loaded yet</div>}
                    <div className={style.videoactions}>
                        <button className='btn btn-primary' onClick={() => this.likebtn()}>Like this Video!</button>
                        <button className='btn btn-info' onClick={() => this.setState({popupvisible: true})}>Give this
                                                                                                             Video a Tag
                        </button>
                        <button className='btn btn-danger' onClick={() => {this.deleteVideo();}}>Delete Video</button>
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
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadVideo');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/video.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    sources: {
                        type: 'video',
                        sources: [
                            {
                                src: result.movie_url,
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
                    suggesttag: result.suggesttag
                });
                console.log(this.state);
            });
    }


    /**
     * click handler for the like btn
     */
    likebtn() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'addLike');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/video.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.result === 'success') {
                        // likes +1 --> avoid reload of all data
                        this.setState({likes: this.state.likes + 1});
                    } else {
                        console.error('an error occured while liking');
                        console.error(result);
                    }
                }));
    }

    /**
     * closebtn click handler
     * calls callback to viewbinding to show previous page agains
     */
    closebtn() {
        this.props.viewbinding.returnToLastElement();
    }

    /**
     * delete the current video and return to last page
     */
    deleteVideo() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'deleteVideo');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/video.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.result === 'success') {
                        // return to last element if successful
                        this.props.viewbinding.returnToLastElement();
                    } else {
                        console.error('an error occured while liking');
                        console.error(result);
                    }
                }));
    }
}

export default Player;
