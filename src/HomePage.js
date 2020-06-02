import React from "react";
import Preview from "./Preview";
import SideBar from "./SideBar";

import "./css/HomePage.css"
import "./css/DefaultPage.css"

class HomePage extends React.Component {
    // stores all available movies
    data = null;
    // stores current index of loaded elements
    loadindex = 0;

    constructor(props, context) {
        super(props, context);

        this.state = {
            loadeditems: [],
            sideinfo: {
                videonr: null,
                fullhdvideonr: null,
                hdvideonr: null,
                sdvideonr: null,
                tagnr: null
            },
            tag: "all"
        };
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
        // initial get of all videos
        this.fetchVideoData("all");
        this.fetchStartData();
    }

    // this function clears all preview elements an reloads gravity with tag
    fetchVideoData(tag) {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');
        updateRequest.append('tag', tag);

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.data = result;
                    this.setState({loadeditems: []});
                    this.loadindex = 0;
                    this.loadPreviewBlock(12);
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

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
                        }});
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

    componentWillUnmount() {
        this.setState({});
        document.removeEventListener('scroll', this.trackScrolling);
    }

    render() {
        return (
            <div>
                <div className='pageheader'>
                    <span className='pageheadertitle'>Home Page</span>
                    <span className='pageheadersubtitle'>All Videos - {this.state.sideinfo.videonr}</span>
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
                    <button className='tagbtn' onClick={() => this.fetchVideoData("all")}>All</button>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("fullhd")}>FullHd</button>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("lowquality")}>LowQuality</button>
                    <button className='tagbtn' onClick={() => this.fetchVideoData("hd")}>HD</button>
                </SideBar>
                <div className='maincontent'>
                    {this.state.loadeditems.map(elem => (
                        <Preview
                            key={elem.movie_id}
                            name={elem.movie_name}
                            movie_id={elem.movie_id}
                            viewbinding={this.props.viewbinding}/>
                    ))}
                </div>
                <div className='rightinfo'>

                </div>

            </div>
        );
    }

    loadPreviewBlock(nr) {
        console.log("loadpreviewblock called ...")
        let ret = [];
        for (let i = 0; i < nr; i++) {
            // only add if not end
            if (this.data.length > this.loadindex + i) {
                ret.push(this.data[this.loadindex + i]);
            }
        }

        this.setState({
            loadeditems: [
                ...this.state.loadeditems,
                ...ret
            ]
        });


        this.loadindex += nr;
    }

    trackScrolling = () => {
        // comparison if current scroll position is on bottom
        // 200 stands for bottom offset to trigger load
        if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
            this.loadPreviewBlock(6);
        }
    }
}

export default HomePage;
