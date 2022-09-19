import React, {PropsWithChildren} from 'react';
import style from './SideBar.module.css';
import GlobalInfos from '../../utils/GlobalInfos';

interface SideBarProps extends  PropsWithChildren{
    hiddenFrame?: boolean;
    width?: string;
}

/**
 * component for sidebar-info
 */
class SideBar extends React.Component<SideBarProps> {
    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        const classnn =
            style.sideinfogeometry +
            ' ' +
            (this.props.hiddenFrame === undefined ? style.sideinfo + ' ' + themeStyle.secbackground : '');

        return (
            <div className={classnn} style={{width: this.props.width}}>
                {this.props.children}
            </div>
        );
    }
}

/**
 * The title of the sidebar
 */
export class SideBarTitle extends React.Component {
    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        return <div className={style.sidebartitle + ' ' + themeStyle.subtextcolor}>{this.props.children}</div>;
    }
}

/**
 * An item of the sidebar
 */
export class SideBarItem extends React.Component {
    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={style.sidebarinfo + ' ' + themeStyle.thirdbackground + ' ' + themeStyle.lighttextcolor}>
                {this.props.children}
            </div>
        );
    }
}

export default SideBar;
