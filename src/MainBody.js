import React from "react";
import HomePage from "./HomePage";
import RandomPage from "./RandomPage";

class MainBody extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    render() {
        let page;
        if (this.props.page === "default") {
            page = <HomePage viewbinding={this.props.viewbinding}/>;
        } else if (this.props.page === "random"){
            page = <RandomPage viewbinding={this.props.viewbinding}/>;
        }else if (this.props.page === "video") {
            // show videoelement if neccessary
            page = this.props.videoelement;
        } else {
            page = <div>unimplemented yet!</div>;
        }
        return (page);
    }
}

export default MainBody;