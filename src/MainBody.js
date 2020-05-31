import React from "react";
import HomePage from "./HomePage";

class MainBody extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        let page;
        if (this.props.page === "default") {
            page = <HomePage/>;
        }else {
            page = <div>unimplemented yet!</div>;
        }
        return (page);
    }
}

export default MainBody;
