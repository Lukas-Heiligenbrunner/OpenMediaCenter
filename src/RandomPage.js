import React from "react";
import Preview from "./Preview";
import "./css/RandomPage.css"
import SideBar from "./SideBar";

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
        return (
            <div>
                <div className='pageheader'>
                    <span className='pageheadertitle'>Random Videos</span>
                    <span className='pageheadersubtitle'>6pc</span>
                    <hr/>
                </div>
                <SideBar>
                    <div className='sidebartitle'>Visible Tags:</div>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("all")}>All</button>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("fullhd")}>FullHd</button>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("lowquality")}>LowQuality</button>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("hd")}>HD</button>
                </SideBar>

                <div className='maincontent'>
                    {this.state.videos.map(elem => (
                        <Preview
                            key={elem.movie_id}
                            name={elem.movie_name}
                            movie_id={elem.movie_id}
                            viewbinding={this.props.viewbinding}/>
                    ))}
                    <div className='Shufflebutton'>
                        <button onClick={() => this.shuffleclick()} className='btnshuffle'>Shuffle</button>
                    </div>
                </div>
            </div>
        );
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
