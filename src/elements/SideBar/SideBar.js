import React from "react";
import style from "./SideBar.module.css"
import StaticInfos from "../../GlobalInfos";
import darktheme from "../../AppDarkTheme.module.css";
import lighttheme from "../../AppLightTheme.module.css";

class SideBar extends React.Component {
    render() {
        const themeStyle = StaticInfos.isDarkTheme() ? darktheme : lighttheme;
        return (<div className={style.sideinfo + ' '+ themeStyle.secbackground}>
            {this.props.children}
        </div>);
    }
}

export class SideBarTitle extends React.Component {
    render() {
        const themeStyle = StaticInfos.isDarkTheme() ? darktheme : lighttheme;
        return (
            <div className={style.sidebartitle + ' '+ themeStyle.subtextcolor}>{this.props.children}</div>
        );
    }
}

export class SideBarItem extends React.Component {
    render() {
        return (
            <div className={style.sidebarinfo}>{this.props.children}</div>
        );
    }
}

export default SideBar;
