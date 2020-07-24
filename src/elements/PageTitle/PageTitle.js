import React from "react";
import style from "./PageTitle.module.css"
import darktheme from "./PageTitleDarkTheme.module.css"
import lighttheme from "./PageTitleLightTheme.module.css"
import StaticInfos from "../../GlobalInfos";

class PageTitle extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

    }

    render() {
        const themeStyle = StaticInfos.isDarkTheme() ? darktheme : lighttheme;
        return (
            <div className={style.pageheader + ' ' + themeStyle.pageheader}>
                <span className={style.pageheadertitle + ' ' + themeStyle.pageheadertitle}>{this.props.title}</span>
                <span className={style.pageheadersubtitle}>{this.props.subtitle}</span>
                <>
                    {this.props.children}
                </>
                <hr/>
            </div>
        )
            ;
    }
}

export default PageTitle;
