import React from "react";
import SideBar from "../../elements/SideBar/SideBar";
import Tag from "../../elements/Tag/Tag";

import {TagPreview} from "../../elements/Preview/Preview";
import NewTagPopup from "../../elements/NewTagPopup/NewTagPopup";
import PageTitle from "../../elements/PageTitle/PageTitle";
import VideoContainer from "../../elements/VideoContainer/VideoContainer";

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

    render() {
        return (
            <>
                <PageTitle
                    title='Categories'
                    subtitle={!this.state.selected ? this.state.loadedtags.length + " different Tags" : this.state.selected}/>

                <SideBar>
                    <div className='sidebartitle'>Default Tags:</div>
                    <Tag viewbinding={this.props.viewbinding} contentbinding={this.loadTag}>All</Tag>
                    <Tag viewbinding={this.props.viewbinding} contentbinding={this.loadTag}>FullHd</Tag>
                    <Tag viewbinding={this.props.viewbinding} contentbinding={this.loadTag}>LowQuality</Tag>
                    <Tag viewbinding={this.props.viewbinding} contentbinding={this.loadTag}>HD</Tag>
                    <hr/>
                    <button data-testid='btnaddtag' className='btn btn-success' onClick={() => {
                        this.setState({popupvisible: true})
                    }}>Add a new Tag!
                    </button>
                </SideBar>

                {!this.state.selected ?
                    (<div className='maincontent'>
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
                    </div>) :
                    <>
                        {this.selectionelements ? this.selectionelements : null}
                        <button data-testid='backbtn' className="btn btn-success"
                                onClick={this.loadCategoryPageDefault}>Back
                        </button>
                    </>
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

    loadTag = (tagname) => {
        // this.selectionelements = element;
        // this.setState({selected: null}); // todo save this change trigger better
        this.fetchVideoData(tagname);
    };

    fetchVideoData(tag) {
        console.log(tag);
        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');
        updateRequest.append('tag', tag);

        console.log("fetching data");

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.selectionelements =
                        <VideoContainer
                            data={result}
                            viewbinding={this.props.viewbinding}/>;
                    this.setState({selected: tag});
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }

    loadCategoryPageDefault = () => {
        this.setState({selected: null});
    };

    /**
     * load all available tags from db.
     */
    loadTags() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getAllTags');

        // fetch all videos available
        fetch('/api/Tags.php', {method: 'POST', body: updateRequest})
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
