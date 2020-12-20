import React from 'react';
import MovieSettings from './MovieSettings';
import GeneralSettings from './GeneralSettings';
import style from './SettingsPage.module.css';
import GlobalInfos from '../../utils/GlobalInfos';
import {NavLink, Redirect, Route, Switch} from "react-router-dom";

/**
 * The Settingspage handles all kinds of settings for the mediacenter
 * and is basically a wrapper for child-tabs
 */
class SettingsPage extends React.Component {
    render(): JSX.Element {
        const themestyle = GlobalInfos.getThemeStyle();
        return (
            <div>
                <div className={style.SettingsSidebar + ' ' + themestyle.secbackground}>
                    <div className={style.SettingsSidebarTitle + ' ' + themestyle.lighttextcolor}>Settings</div>
                    <NavLink to='/settings/general'>
                        <div className={style.SettingSidebarElement}>General</div>
                    </NavLink>
                    <NavLink to='/settings/movies'>
                        <div className={style.SettingSidebarElement}>Movies</div>
                    </NavLink>
                    <NavLink to='/settings/tv'>
                        <div className={style.SettingSidebarElement}>TV Shows</div>
                    </NavLink>
                </div>
                <div className={style.SettingsContent}>
                    <Switch>
                        <Route path="/settings/general">
                            <GeneralSettings/>
                        </Route>
                        <Route path="/settings/movies">
                            <MovieSettings/>
                        </Route>
                        <Route path="/settings/tv">
                            <span/>
                        </Route>
                        <Route path="/settings">
                            <Redirect to='/settings/general'/>
                        </Route>
                    </Switch>
                </div>
            </div>
        );
    }
}

export default SettingsPage;
