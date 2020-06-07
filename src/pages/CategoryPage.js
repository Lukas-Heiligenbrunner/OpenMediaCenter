import React from "react";
import SideBar from "../elements/SideBar";
import Tag from "../elements/Tag";

import "../css/CategoryPage.css"
import {TagPreview} from "../elements/Preview";

class CategoryPage extends React.Component {
    constructor(props: P, context: any) {
        super(props, context);

        this.props = props;

        this.state = {
            loadedtags: []
        };
    }

    componentDidMount() {
        this.loadTags();
    }

    render() {
        return (
            <>
                <div className='pageheader'>
                    <span className='pageheadertitle'>Category Page</span>
                    <span
                        className='pageheadersubtitle'>{this.state.loadedtags ? this.state.loadedtags.length + " different Tags" : ""}</span>
                    <hr/>
                </div>
                <SideBar>
                    <div className='sidebartitle'>Default Tags:</div>
                    <Tag>All</Tag>
                    <Tag>FullHd</Tag>
                    <Tag>LowQuality</Tag>
                    <Tag>HD</Tag>
                    <hr/>
                    <button className='btn btn-success'>Add a new Tag!</button>
                </SideBar>
                <div id='categorycontent'>
                    {this.state.loadedtags ?
                        this.state.loadedtags.map((m) => (
                            <TagPreview
                                name={m.tag_name}
                                tag_id={m.tag_id}
                                viewbinding={this.props.viewbinding}/>
                        )) :
                        "loading"
                    }

                </div>
            </>
        );
    }

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