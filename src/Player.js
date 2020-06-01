import React from "react";
import "./css/Player.css"
import {PlyrComponent} from 'plyr-react';


class Player extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {};

        this.props = props;
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
                <div className="row">
                    <div className="col-sm-2">
                        <div className="videoleftbanner">
                            <div className="likefield">Likes: {this.state.likes}</div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="videowrapper">
                            <div className='myvideo'>
                                {this.state.sources ? <PlyrComponent
                                        sources={this.state.sources}
                                        options={this.options}/> :
                                    <div>not loaded yet</div>}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="closebutton" onClick={() => {this.closebtn()}}>Close</div>
                        <div className="videorightbanner"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-5">


                    </div>
                    <div className="col-sm-2">
                        <button className='btn btn-primary' onClick={() => {this.likebtn()}}>Like it!</button>
                        <button className='btn btn-info' id="tagbutton">Tag it!</button>

                    </div>
                    <div className="col-sm-5">


                    </div>
                </div>
            </div>
        );
    }

    fetchMovieData(){
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
                    likes: result.likes
                });
            });
    }


    /* Click Listener */
    likebtn() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'addLike');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                if(result.result === "success"){
                    this.fetchMovieData();
                }else{
                    console.log("an error occured while liking");
                    console.log(result);
                }
            });
    }

    closebtn() {
        // todo go back to correct page here!
        // have a catch to <Route>
        this.props.viewbinding.hideVideo();
    }
}

export default Player;
