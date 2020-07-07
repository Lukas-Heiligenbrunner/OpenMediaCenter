import React from "react";
import style from "./SideBar.module.css"

class SideBar extends React.Component {
    render() {
        return (<div className={style.sideinfo}>
            {this.props.children}
        </div>);
    }
}

export class SideBarTitle extends React.Component {
    render() {
        return (
            <div className={style.sidebartitle}>{this.props.children}</div>
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
