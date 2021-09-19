import React from 'react';
import MovieSettings from './MovieSettings';
import GeneralSettings from './GeneralSettings';
import style from './SettingsPage.module.css';
import GlobalInfos from '../../utils/GlobalInfos';
import {NavLink, Redirect, Route, Switch, useRouteMatch} from 'react-router-dom';

/**
 * The Settingspage handles all kinds of settings for the mediacenter
 * and is basically a wrapper for child-tabs
 */
const SettingsPage = (): JSX.Element => {
    const themestyle = GlobalInfos.getThemeStyle();
    const match = useRouteMatch();

    return (
        <div>
            <div className={style.SettingsSidebar + ' ' + themestyle.secbackground}>
                <div className={style.SettingsSidebarTitle + ' ' + themestyle.lighttextcolor}>Settings</div>
                <NavLink to='/media/settings/general'>
                    <div className={style.SettingSidebarElement}>General</div>
                </NavLink>
                <NavLink to='/media/settings/movies'>
                    <div className={style.SettingSidebarElement}>Movies</div>
                </NavLink>
                {GlobalInfos.isTVShowEnabled() ? (
                    <NavLink to='/media/settings/tv'>
                        <div className={style.SettingSidebarElement}>TV Shows</div>
                    </NavLink>
                ) : null}
            </div>
            <div className={style.SettingsContent}>
                <Switch>
                    <Route path={`${match.url}/general`}>
                        <GeneralSettings />
                    </Route>
                    <Route path={`${match.url}/movies`}>
                        <MovieSettings />
                    </Route>
                    {GlobalInfos.isTVShowEnabled() ? (
                        <Route path={`${match.url}/tv`}>
                            <span />
                        </Route>
                    ) : null}
                    <Route path={`${match.url}/`}>
                        <Redirect to='/media/settings/general' />
                    </Route>
                </Switch>
            </div>
        </div>
    );
};

export default SettingsPage;
