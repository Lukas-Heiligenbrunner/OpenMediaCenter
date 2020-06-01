import React from "react";
import Preview from "./Preview";
import "./css/RandomPage.css"

class RandomPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            videos: []
        };
    }

    componentDidMount() {
        this.loadShuffledvideos(6);
    }

    render() {
        return (<div>
            <div><h1>Random Videos</h1></div>
            <div className='sideinfo'>
                todo here.
            </div>
            <div className='maincontent'>
                {this.state.videos.map(elem => (
                    <Preview
                        key={elem.movie_id}
                        name={elem.movie_name}
                        movie_id={elem.movie_id}
                        viewbinding={this.props.viewbinding}/>
                ))}
            </div>
            <div className='rightinfo'>
                right
            </div>
            <div className='Shufflebutton'>
                <button onClick={() => {
                    this.shuffleclick()
                }} className='btn btn-success'>Shuffle
                </button>
            </div>

        </div>);
    }

    shuffleclick() {
        this.loadShuffledvideos(6);
    }

    loadShuffledvideos(nr) {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getRandomMovies');
        updateRequest.append('number', nr);

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({videos: result});
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }
}

export default RandomPage;
