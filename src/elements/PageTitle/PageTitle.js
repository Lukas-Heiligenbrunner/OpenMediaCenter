import React from "react";
import "./PageTitle.css"

class PageTitle extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

    }

    render() {
        return (
            <div className='pageheader'>
                <span className='pageheadertitle'>{this.props.title}</span>
                <span className='pageheadersubtitle'>{this.props.subtitle}</span>
                {this.props.children}
                <hr/>
            </div>
        );
    }
}

export default PageTitle;