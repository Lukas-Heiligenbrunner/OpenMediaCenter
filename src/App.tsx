import React, {useContext} from 'react';
import HomePage from './pages/HomePage/HomePage';
import RandomPage from './pages/RandomPage/RandomPage';
import GlobalInfos from './utils/GlobalInfos';

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.module.css';

import SettingsPage from './pages/SettingsPage/SettingsPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';

import {NavLink, Route, Routes} from 'react-router-dom';
import Player from './pages/Player/Player';
import ActorOverviewPage from './pages/ActorOverviewPage/ActorOverviewPage';
import ActorPage from './pages/ActorPage/ActorPage';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import TVShowPage from './pages/TVShowPage/TVShowPage';
import TVPlayer from './pages/TVShowPage/TVPlayer';
import {LoginContextProvider} from './utils/context/LoginContextProvider';
import {FeatureContext} from './utils/context/FeatureContext';

interface state {
    mediacentername: string;
}

/**
 * The main App handles the main tabs and which content to show
 */
class App extends React.Component<{}, state> {
    constructor(props: {}) {
        super(props);

        this.state = {
            mediacentername: 'OpenMediaCenter'
        };

        // force an update on theme change
        GlobalInfos.onThemeChange(() => {
            this.forceUpdate();
        });
    }

    render(): JSX.Element {
        // add the main theme to the page body
        document.body.className = GlobalInfos.getThemeStyle().backgroundcolor;

        return (
            <LoginContextProvider>
                <Routes>
                    <Route path='/login'>
                        <AuthenticationPage />
                    </Route>
                    <Route path='/media'>
                        {this.navBar()}
                        <MyRouter />
                    </Route>
                </Routes>
            </LoginContextProvider>
        );
    }

    static contextType = FeatureContext;

    activeTab(history, path) {
        if (history.location.pathname === path) {
            return { color: "red" };
        }
    };

    /**
     * render the top navigation bar
     */
    navBar(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();

        return (
            <div className={[style.navcontainer, themeStyle.backgroundcolor, themeStyle.textcolor, themeStyle.hrcolor].join(' ')}>
                <div className={style.navbrand}>{this.state.mediacentername}</div>
                <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/media'} activeStyle={{opacity: '0.85'}}>
                    Home
                </NavLink>
                <NavLink
                    to={'/media/random'}
                    className={({ isActive }) => [style.navitem, themeStyle.navitem, (isActive ? 'navitem-active' : '')].join(' ')}>
                    Random Video
                </NavLink>

                <NavLink
                    className={({ isActive }) => [style.navitem, themeStyle.navitem, (isActive ? 'navitem-active' : '')].join(' ')}
                    to={'/media/categories'}>
                    Categories
                </NavLink>

                <NavLink
                    className={({ isActive }) => [style.navitem, themeStyle.navitem, (isActive ? 'navitem-active' : '')].join(' ')}
                    to={'/media/actors'}>
                    Actors
                </NavLink>

                {this.context.TVShowEnabled ? (
                    <NavLink
                        className={({ isActive }) => [style.navitem, themeStyle.navitem, (isActive ? 'navitem-active' : '')].join(' ')}
                        to={'/media/tvshows'}>
                        TV Shows
                    </NavLink>
                ) : null}

                <NavLink
                    className={({ isActive }) => [style.navitem, themeStyle.navitem, (isActive ? 'navitem-active' : '')].join(' ')}
                    to={'/media/settings'}>
                    Settings
                </NavLink>
            </div>
        );
    }
}

const MyRouter = (): JSX.Element => {
    const match = useRouteMatch();
    const features = useContext(FeatureContext);

    return (
        <Switch>
            <Route exact path={`${match.url}/random`}>
                <RandomPage />
            </Route>
            <Route path={`${match.url}/categories`}>
                <CategoryPage />
            </Route>
            <Route path={`${match.url}/settings`}>
                <SettingsPage />
            </Route>
            <Route exact path={`${match.url}/player/:id`}>
                <Player />
            </Route>
            <Route exact path={`${match.url}/actors`}>
                <ActorOverviewPage />
            </Route>
            <Route exact path={`${match.url}/actors/:id`}>
                <ActorPage />
            </Route>

            {features.TVShowEnabled ? (
                <Route path={`${match.url}/tvshows`}>
                    <TVShowPage />
                </Route>
            ) : null}

            {features.TVShowEnabled ? (
                <Route exact path={`${match.url}/tvplayer/:id`}>
                    <TVPlayer />
                </Route>
            ) : null}

            <Route path={`${match.url}/`}>
                <HomePage />
            </Route>
        </Switch>
    );
};

export default App;
