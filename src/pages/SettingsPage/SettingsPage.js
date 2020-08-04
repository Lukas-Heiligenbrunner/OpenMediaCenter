import React from "react";
import MovieSettings from "./MovieSettings";
import GeneralSettings from "./GeneralSettings";
import style from "./SettingsPage.module.css"
import StaticInfos from "../../GlobalInfos";


class SettingsPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            currentpage: "general"
        };
    }

    getContent() {
        switch (this.state.currentpage) {
            case "general":
                return <GeneralSettings/>;
            case "movies":
                return <MovieSettings/>;
            case "tv":
                return <span/>; // todo this page
            default:
                return "unknown button clicked";
        }
    }

    render() {
        const themestyle = StaticInfos.getThemeStyle();
        return (
            <div>
                <div className={style.SettingsSidebar + ' ' + themestyle.secbackground}>
                    <div className={style.SettingsSidebarTitle + ' ' + themestyle.lighttextcolor}>Settings</div>
                    <div onClick={() => this.setState({currentpage: "general"})}
                         className={style.SettingSidebarElement}>General
                    </div>
                    <div onClick={() => this.setState({currentpage: "movies"})}
                         className={style.SettingSidebarElement}>Movies
                    </div>
                    <div onClick={() => this.setState({currentpage: "tv"})}
                         className={style.SettingSidebarElement}>TV Shows
                    </div>
                </div>
                <div className={style.SettingsContent}>
                    {this.getContent()}
                </div>
            </div>
        );
    }
}

export default SettingsPage;
