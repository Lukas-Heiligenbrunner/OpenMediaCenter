import React from "react";

import "./css/Tag.css"

class Tag extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        // todo onclick events correctly
        return (
            <button className='tagbtn' onClick={this.props.onClick}>{this.props.children}</button>
        );
    }
}

export default Tag;
