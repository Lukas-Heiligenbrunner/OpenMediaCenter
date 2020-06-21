import React from "react";

import "./Tag.css"
import VideoContainer from "../VideoContainer/VideoContainer";

class Tag extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        return (
            <button className='tagbtn' onClick={() => this.TagClick()}
                    data-testid="Test-Tag">{this.props.children}</button>
        );
    }

    TagClick() {
        const tag = this.props.children.toString().toLowerCase();

        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');
        updateRequest.append('tag', tag);

        // fetch all videos available
        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.props.contentbinding(
                        <VideoContainer
                            data={result}
                            viewbinding={this.props.viewbinding}/>, tag
                    );
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }
}

export default Tag;
