import React from "react";
import style from "./Player.module.css"
import {PlyrComponent} from 'plyr-react';
import SideBar, {SideBarTitle, SideBarItem} from "../../elements/SideBar/SideBar";
import Tag from "../../elements/Tag/Tag";
import AddTagPopup from "../../elements/AddTagPopup/AddTagPopup";
import PageTitle from "../../elements/PageTitle/PageTitle";


class Player extends React.Component {
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
            popupvisible: false
        };
    }

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
            'fullscreen', // Toggle fullscreen
        ]
    };

    componentDidMount() {
        this.fetchMovieData();
    }

    render() {
        return (
            <div id='videocontainer'>
                <PageTitle
                    title='Watch'
                    subtitle={this.state.movie_name}/>

                <SideBar>
                    <SideBarTitle>Infos:</SideBarTitle>
                    <hr/>
                    <SideBarItem><b>{this.state.likes}</b> Likes!</SideBarItem>
                    {this.state.quality !== 0 ?
                        <SideBarItem><b>{this.state.quality}p</b> Quality!</SideBarItem> : null}
                    {this.state.length !== 0 ?
                        <SideBarItem><b>{Math.round(this.state.length / 60)}</b> Minutes of length!</SideBarItem>: null}
                    <hr/>
                    <SideBarTitle>Tags:</SideBarTitle>
                    {this.state.tags.map((m) => (
                        <Tag
                            key={m.tag_name}
                            viewbinding={this.props.viewbinding}>{m.tag_name}</Tag>
                    ))}
                </SideBar>

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
                        {this.state.popupvisible ?
                            <AddTagPopup show={this.state.popupvisible}
                                         onHide={() => {
                                             this.setState({popupvisible: false});
                                             this.fetchMovieData();
                                         }}
                                         movie_id={this.state.movie_id}/> :
                            null
                        }

                    </div>
                </div>
                <button className={style.closebutton} onClick={() => this.closebtn()}>Close</button>
            </div>
        );
    }

    fetchMovieData() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadVideo');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    sources: {
                        type: 'video',
                        sources: [
                            {
                                src: result.movie_url,
                                type: 'video/mp4',
                                size: 1080,
                            }
                        ],
                        poster: result.thumbnail
                    },
                    movie_id: result.movie_id,
                    movie_name: result.movie_name,
                    likes: result.likes,
                    quality: result.quality,
                    length: result.length,
                    tags: result.tags
                });
            });
    }


    /* Click Listener */
    likebtn() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'addLike');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.result === "success") {
                        this.fetchMovieData();
                    } else {
                        console.log("an error occured while liking");
                        console.log(result);
                    }
                }));
    }

    closebtn() {
        this.props.viewbinding.returnToLastElement();
    }
}

export default Player;
