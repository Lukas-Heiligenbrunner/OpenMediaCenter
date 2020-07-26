import React from "react";
import style from "./PageTitle.module.css"
import darktheme from "../../AppDarkTheme.module.css"
import lighttheme from "../../AppLightTheme.module.css"
import StaticInfos from "../../GlobalInfos";

class PageTitle extends React.Component {
    constructor(props) {
        super(props);

        this.props = props;

    }

    render() {
        const themeStyle = StaticInfos.isDarkTheme() ? darktheme : lighttheme;
        return (
            <div className={style.pageheader + ' ' + themeStyle.backgroundcolor}>
                <span className={style.pageheadertitle + ' ' + themeStyle.textcolor}>{this.props.title}</span>
                <span className={style.pageheadersubtitle + ' ' + themeStyle.textcolor}>{this.props.subtitle}</span>
                <>
                    {this.props.children}
                </>
                <hr className={themeStyle.hrcolor}/>
            </div>
        );
    }
}

export default PageTitle;
