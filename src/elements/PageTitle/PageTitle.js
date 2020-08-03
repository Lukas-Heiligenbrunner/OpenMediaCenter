import React from "react";
import style from "./PageTitle.module.css"
import StaticInfos from "../../GlobalInfos";

class PageTitle extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

    }

    render() {
        const themeStyle = StaticInfos.getThemeStyle();
        return (
            <div className={style.pageheader + ' ' + themeStyle.backgroundcolor}>
                <span className={style.pageheadertitle + ' ' + themeStyle.textcolor}>{this.props.title}</span>
                <span className={style.pageheadersubtitle + ' ' + themeStyle.textcolor}>{this.props.subtitle}</span>
                <>
                    {this.props.children}
                </>
                <Line/>
            </div>
        );
    }
}

/**
 * class to override default <hr> color and styling
 * use this for horizontal lines to use the current active theming
 */
export class Line extends React.Component {
    render() {
        const themeStyle = StaticInfos.getThemeStyle();
        return (
            <>
                <hr className={themeStyle.hrcolor}/>
            </>
        );
    }
}

export default PageTitle;
