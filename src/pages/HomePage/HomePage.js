import React from "react";
import SideBar, {SideBarItem, SideBarTitle} from "../../elements/SideBar/SideBar";
import Tag from "../../elements/Tag/Tag";
import VideoContainer from "../../elements/VideoContainer/VideoContainer";

import style from "./HomePage.module.css"
import PageTitle, {Line} from "../../elements/PageTitle/PageTitle";

class HomePage extends React.Component {
    /** keyword variable needed temporary store search keyword */
    keyword = "";

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
            <>
                <PageTitle
                    title='Home Page'
                    subtitle={this.state.tag + " Videos - " + this.state.selectionnr}>
                    <form className={"form-inline " + style.searchform} onSubmit={(e) => {
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
                </PageTitle>
                <SideBar>
                    <SideBarTitle>Infos:</SideBarTitle>
                    <Line/>
                    <SideBarItem><b>{this.state.sideinfo.videonr}</b> Videos Total!</SideBarItem>
                    <SideBarItem><b>{this.state.sideinfo.fullhdvideonr}</b> FULL-HD Videos!</SideBarItem>
                    <SideBarItem><b>{this.state.sideinfo.hdvideonr}</b> HD Videos!</SideBarItem>
                    <SideBarItem><b>{this.state.sideinfo.sdvideonr}</b> SD Videos!</SideBarItem>
                    <SideBarItem><b>{this.state.sideinfo.tagnr}</b> different Tags!</SideBarItem>
                    <Line/>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag viewbinding={this.props.viewbinding}>All</Tag>
                    <Tag viewbinding={this.props.viewbinding}>FullHd</Tag>
                    <Tag viewbinding={this.props.viewbinding}>LowQuality</Tag>
                    <Tag viewbinding={this.props.viewbinding}>HD</Tag>
                </SideBar>
                {this.state.data.length !== 0 ?
                    <VideoContainer
                        data={this.state.data}
                        viewbinding={this.props.viewbinding}/> :
                    <div>No Data found!</div>}
                <div className={style.rightinfo}>

                </div>

            </>
        );
    }
}

export default HomePage;
