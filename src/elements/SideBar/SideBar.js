import React from "react";
import style from "./SideBar.module.css"
import StaticInfos from "../../GlobalInfos";

class SideBar extends React.Component {
    render() {
        const themeStyle = StaticInfos.getThemeStyle();
        return (<div className={style.sideinfo + ' '+ themeStyle.secbackground}>
            {this.props.children}
        </div>);
    }
}

export class SideBarTitle extends React.Component {
    render() {
        const themeStyle = StaticInfos.getThemeStyle();
        return (
            <div className={style.sidebartitle + ' '+ themeStyle.subtextcolor}>{this.props.children}</div>
        );
    }
}

export class SideBarItem extends React.Component {
    render() {
        const themeStyle = StaticInfos.getThemeStyle();
        return (
            <div className={style.sidebarinfo + ' ' + themeStyle.thirdbackground + ' ' + themeStyle.lighttextcolor}>{this.props.children}</div>
        );
    }
}

export default SideBar;
