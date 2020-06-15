import React from "react";
import SideBar from "../../elements/SideBar/SideBar";
import Tag from "../../elements/Tag/Tag";
import VideoContainer from "../../elements/VideoContainer/VideoContainer";

import "./HomePage.css"
import "../../css/DefaultPage.css"

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            sideinfo: {
                videonr: null,
                fullhdvideonr: null,
                hdvideonr: null,
                sdvideonr: null,
                tagnr: null
            },
            tag: "All",
            data: [],
            selectionnr: 0
        };
    }

    /** keyword variable needed temporary store search keyword */
    keyword = "";

    componentDidMount() {
        // initial get of all videos
        this.fetchVideoData("all");
        this.fetchStartData();
    }

    /**
     * fetch available videos for specified tag
     * this function clears all preview elements an reloads gravity with tag
     *
     * @param tag tag to fetch videos
     */
    fetchVideoData(tag) {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');
        updateRequest.append('tag', tag);

        console.log("fetching data");

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({
                        data: []
                    });
                    this.setState({
                        data: result,
                        selectionnr: result.length
                    });
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

    /**
     * fetch the necessary data for left info box
     */
    fetchStartData() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getStartData');

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({
                        sideinfo: {
                            videonr: result['total'],
                            fullhdvideonr: result['fullhd'],
                            hdvideonr: result['hd'],
                            sdvideonr: result['sd'],
                            tagnr: result['tags']
                        }
                    });
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

    /**
     * search for a keyword in db and update previews
     *
     * @param keyword The keyword to search for
     */
    searchVideos(keyword) {
        console.log("search called");

        const updateRequest = new FormData();
        updateRequest.append('action', 'getSearchKeyWord');
        updateRequest.append('keyword', keyword);

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({
                        data: []
                    });
                    this.setState({
                        data: result,
                        selectionnr: result.length
                    });
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

    render() {
        return (
            <div>
                <div className='pageheader'>
                    <span className='pageheadertitle'>Home Page</span>
                    <span className='pageheadersubtitle'>{this.state.tag} Videos - {this.state.selectionnr}</span>
                    <form className="form-inline searchform" onSubmit={(e) => {
                        e.preventDefault();
                        this.searchVideos(this.keyword);
                    }}>
                        <input data-testid='searchtextfield' className="form-control mr-sm-2"
                               type="text" placeholder="Search"
                               onChange={(e) => {
                                   this.keyword = e.target.value
                               }}/>
                        <button data-testid='searchbtnsubmit' className="btn btn-success" type="submit">Search</button>
                    </form>
                    <hr/>
                </div>
                <SideBar>
                    <div className='sidebartitle'>Infos:</div>
                    <hr/>
                    <div className='sidebarinfo'><b>{this.state.sideinfo.videonr}</b> Videos Total!</div>
                    <div className='sidebarinfo'><b>{this.state.sideinfo.fullhdvideonr}</b> FULL-HD Videos!</div>
                    <div className='sidebarinfo'><b>{this.state.sideinfo.hdvideonr}</b> HD Videos!</div>
                    <div className='sidebarinfo'><b>{this.state.sideinfo.sdvideonr}</b> SD Videos!</div>
                    <div className='sidebarinfo'><b>{this.state.sideinfo.tagnr}</b> different Tags!</div>
                    <hr/>
                    <div className='sidebartitle'>Default Tags:</div>
                    <Tag onClick={() => {
                        this.setState({tag: "All"});
                        this.fetchVideoData("all");
                    }}>All
                    </Tag>
                    <Tag onClick={() => {
                        this.setState({tag: "Full HD"});
                        this.fetchVideoData("fullhd");
                    }}>FullHd
                    </Tag>
                    <Tag onClick={() => {
                        this.setState({tag: "Low Quality"});
                        this.fetchVideoData("lowquality");
                    }}>LowQuality
                    </Tag>
                    <Tag onClick={() => {
                        this.setState({tag: "HD"});
                        this.fetchVideoData("hd");
                    }}>HD
                    </Tag>
                </SideBar>
                {this.state.data.length !== 0 ?
                    <VideoContainer
                        data={this.state.data}
                        viewbinding={this.props.viewbinding}/> :
                    <div>No Data found!</div>}
                <div className='rightinfo'>

                </div>

            </div>
        );
    }
}

export default HomePage;
