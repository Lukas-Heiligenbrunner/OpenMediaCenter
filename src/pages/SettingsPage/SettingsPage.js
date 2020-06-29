import React from "react";
import MovieSettings from "./MovieSettings";
import GeneralSettings from "./GeneralSettings";
import "./SettingsPage.css"


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
        return (
            <div>
                <div className='SettingsSidebar'>
                    <div className='SettingsSidebarTitle'>Settings</div>
                    <div onClick={() => this.setState({currentpage: "general"})}
                         className='SettingSidebarElement'>General
                    </div>
                    <div onClick={() => this.setState({currentpage: "movies"})}
                         className='SettingSidebarElement'>Movies
                    </div>
                    <div onClick={() => this.setState({currentpage: "tv"})}
                         className='SettingSidebarElement'>TV Shows
                    </div>
                </div>
                <div className='SettingsContent'>
                    {this.getContent()}
                </div>
            </div>
        );
    }
}

export default SettingsPage;
