import React from "react";
import style from "./PageTitle.module.css"

class PageTitle extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

    }

    render() {
        return (
            <div className={style.pageheader}>
                <span className={style.pageheadertitle}>{this.props.title}</span>
                <span className={style.pageheadersubtitle}>{this.props.subtitle}</span>
                <>
                    {this.props.children}
                </>
                <hr/>
            </div>
        );
    }
}

export default PageTitle;