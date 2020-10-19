import React from "react";
import SideBar, {SideBarTitle} from "../../elements/SideBar/SideBar";
import Tag from "../../elements/Tag/Tag";
import videocontainerstyle from "../../elements/VideoContainer/VideoContainer.module.css"

import {TagPreview} from "../../elements/Preview/Preview";
import NewTagPopup from "../../elements/NewTagPopup/NewTagPopup";
import PageTitle, {Line} from "../../elements/PageTitle/PageTitle";
import VideoContainer from "../../elements/VideoContainer/VideoContainer";

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
class CategoryPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loadedtags: [],
            selected: null
        };
    }

    componentDidMount() {
        // check if predefined category is set
        if (this.props.category) {
            this.fetchVideoData(this.props.category);
        } else {
            this.loadTags();
        }
    }

    /**
     * render the Title and SideBar component for the Category page
     * @returns {JSX.Element} corresponding jsx element for Title and Sidebar
     */
    renderSideBarATitle() {
        return (
            <>
                <PageTitle
                    title='Categories'
                    subtitle={!this.state.selected ? this.state.loadedtags.length + " different Tags" : this.state.selected}/>

                <SideBar>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag viewbinding={{
                        changeRootElement: (e) => {
                            this.loadTag(e.props.category)
                        }
                    }}>All</Tag>
                    <Tag viewbinding={{
                        changeRootElement: (e) => {
                            this.loadTag(e.props.category)
                        }
                    }}>FullHd</Tag>
                    <Tag viewbinding={{
                        changeRootElement: (e) => {
                            this.loadTag(e.props.category)
                        }
                    }}>LowQuality</Tag>
                    <Tag viewbinding={{
                        changeRootElement: (e) => {
                            this.loadTag(e.props.category)
                        }
                    }}>HD</Tag>
                    <Line/>
                    <button data-testid='btnaddtag' className='btn btn-success' onClick={() => {
                        this.setState({popupvisible: true})
                    }}>Add a new Tag!
                    </button>
                </SideBar></>
        );
    }

    render() {
        return (
            <>
                {this.renderSideBarATitle()}

                {this.state.selected ?
                    <>
                        {this.videodata ?
                            <VideoContainer
                                data={this.videodata}
                                viewbinding={this.props.viewbinding}/> : null}
                        <button data-testid='backbtn' className='btn btn-success'
                                onClick={this.loadCategoryPageDefault}>Back
                        </button>
                    </> :
                    <div className={videocontainerstyle.maincontent}>
                        {this.state.loadedtags ?
                            this.state.loadedtags.map((m) => (
                                <TagPreview
                                    key={m.tag_name}
                                    name={m.tag_name}
                                    tag_id={m.tag_id}
                                    viewbinding={this.props.viewbinding}
                                    categorybinding={this.loadTag}/>
                            )) :
                            "loading"}
                    </div>
                }

                {this.state.popupvisible ?
                    <NewTagPopup show={this.state.popupvisible}
                                 onHide={() => {
                                     this.setState({popupvisible: false});
                                     this.loadTags();
                                 }}/> :
                    null
                }

            </>
        );
    }

    /**
     * load a specific tag into a new previewcontainer
     * @param tagname
     */
    loadTag = (tagname) => {
        this.fetchVideoData(tagname);
    };

    /**
     * fetch data for a specific tag from backend
     * @param tag tagname
     */
    fetchVideoData(tag) {
        console.log(tag);
        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');
        updateRequest.append('tag', tag);

        console.log("fetching data");

        // fetch all videos available
        fetch('/api/video.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.videodata = result;
                    this.setState({selected: null}); // needed to trigger the state reload correctly
                    this.setState({selected: tag});
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

    /**
     * go back to the default category overview
     */
    loadCategoryPageDefault = () => {
        this.setState({selected: null});
        this.loadTags();
    };

    /**
     * load all available tags from db.
     */
    loadTags() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getAllTags');

        // fetch all videos available
        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({loadedtags: result});
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }
}

export default CategoryPage;
