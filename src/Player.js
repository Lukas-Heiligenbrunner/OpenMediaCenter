import React from "react";
import "./css/Player.css"
import {PlyrComponent} from 'plyr-react';


class Player extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            sources: {
                type: 'video',
                sources: [
                    {
                        src: '',
                        type: 'video/mp4',
                        size: 1080,
                    }
                ],
                poster: ''
            }
        };

        this.props = props;
    }

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadVideo');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/php/videoload.php', {method: 'POST', body: updateRequest})
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
                    }
                });
                console.log(this.state);
            });

    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-sm-2">
                        <div className="videoleftbanner">
                            <div className="likefield">Likes: 10</div>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <div className="videowrapper">
                            <div className='myvideo'>
                                {this.state.sources.sources[0].src ? <PlyrComponent sources={this.state.sources}/> :
                                    <div>not loaded yet</div>}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-2">
                        <div className="closebutton">Close</div>
                        <div className="videorightbanner"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-5">


                    </div>
                    <div className="col-sm-2">
                        <button id="likebtn">Like it!</button>
                        <button id="tagbutton">Tag it!</button>

                    </div>
                    <div className="col-sm-5">


                    </div>
                </div>
            </div>
        );
    }
}

export default Player;
