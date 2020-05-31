import React from "react";
import "./css/Player.css"
import {PlyrComponent} from 'plyr-react';


class Player extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            sources: null
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
                console.log(result);
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
                        poster: result["thumbnail"]
                    }
                });
                console.log(this.state);
            });

    }

    render() {
        return (
            <div className='myvideo'>
                {this.state.sources ? <PlyrComponent sources={this.state.sources}/> : <div>loading</div>}
            </div>
        );
    }
}

export default Player;
