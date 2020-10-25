import React from 'react';
import style from './SideBar.module.css';
import GlobalInfos from '../../GlobalInfos';

/**
 * component for sidebar-info
 */
class SideBar extends React.Component {
    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (<div className={style.sideinfo + ' ' + themeStyle.secbackground}>
            {this.props.children}
        </div>);
    }
}

/**
 * The title of the sidebar
 */
export class SideBarTitle extends React.Component {
    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={style.sidebartitle + ' ' + themeStyle.subtextcolor}>{this.props.children}</div>
        );
    }
}

/**
 * An item of the sidebar
 */
export class SideBarItem extends React.Component {
    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div
                className={style.sidebarinfo + ' ' + themeStyle.thirdbackground + ' ' + themeStyle.lighttextcolor}>{this.props.children}</div>
        );
    }
}

export default SideBar;
