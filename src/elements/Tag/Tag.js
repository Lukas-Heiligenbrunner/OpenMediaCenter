import React from "react";

import "./Tag.css"

class Tag extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        // todo onclick events correctlyy
        return (
            <button className='tagbtn' onClick={this.props.onClick} data-testid="Test-Tag">{this.props.children}</button>
        );
    }
}

export default Tag;
