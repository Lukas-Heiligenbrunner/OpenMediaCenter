import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import RandomPage from './pages/RandomPage/RandomPage';
import GlobalInfos from './utils/GlobalInfos';

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.module.css';

import SettingsPage from './pages/SettingsPage/SettingsPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';

import {BrowserRouter as Router, NavLink, Route, Switch} from 'react-router-dom';
import Player from './pages/Player/Player';
import ActorOverviewPage from './pages/ActorOverviewPage/ActorOverviewPage';
import ActorPage from './pages/ActorPage/ActorPage';
import {APINode, SettingsTypes} from './types/ApiTypes';
import AuthenticationPage from './pages/AuthenticationPage/AuthenticationPage';
import TVShowPage from './pages/TVShowPage/TVShowPage';
import TVPlayer from './pages/TVShowPage/TVPlayer';
import {CookieTokenStore, token} from 'gowebsecure';
import {callAPI} from 'gowebsecure';

interface state {
    password: boolean | null; // null if uninitialized - true if pwd needed false if not needed
    mediacentername: string;
}

/**
 * The main App handles the main tabs and which content to show
 */
class App extends React.Component<{}, state> {
    constructor(props: {}) {
        super(props);

        token.init(new CookieTokenStore());

        let pwdneeded: boolean | null = null;

        if (token.apiTokenValid()) {
            pwdneeded = false;
        } else {
            token.refreshAPIToken(
                (err) => {
                    if (err === 'invalid_client') {
                        this.setState({password: true});
                    } else if (err === '') {
                        this.setState({password: false});
                    } else {
                        console.log('unimplemented token error: ' + err);
                    }
                },
                true,
                'openmediacenter',
                '0'
            );
        }

        this.state = {
            mediacentername: 'OpenMediaCenter',
            password: pwdneeded
        };

        // force an update on theme change
        GlobalInfos.onThemeChange(() => {
            this.forceUpdate();
        });

        // set the hook to load passwordfield on global func call
        GlobalInfos.loadPasswordPage = (callback?: () => void): void => {
            // try refreshing the token
            token.refreshAPIToken((err) => {
                if (err !== '') {
                    this.setState({password: true});
                } else {
                    // call callback if request was successful
                    if (callback) {
                        callback();
                    }
                }
            }, true);
        };
    }

    initialAPICall(): void {
        // this is the first api call so if it fails we know there is no connection to backend
        callAPI(APINode.Settings, {action: 'loadInitialData'}, (result: SettingsTypes.initialApiCallData) => {
            // set theme
            GlobalInfos.enableDarkTheme(result.DarkMode);

            GlobalInfos.setVideoPaths(result.VideoPath, result.TVShowPath);

            GlobalInfos.setTVShowsEnabled(result.TVShowEnabled);

            this.setState({
                mediacentername: result.MediacenterName
            });
            // set tab title to received mediacenter name
            document.title = result.MediacenterName;
        });
    }

    componentDidMount(): void {
        this.initialAPICall();
    }

    render(): JSX.Element {
        // add the main theme to the page body
        document.body.className = GlobalInfos.getThemeStyle().backgroundcolor;

        if (this.state.password === true) {
            // render authentication page if auth is neccessary
            return (
                <AuthenticationPage
                    onSuccessLogin={(): void => {
                        this.setState({password: false});
                        // reinit general infos
                        this.initialAPICall();
                    }}
                />
            );
        } else if (this.state.password === false) {
            return (
                <Router>
                    <div className={style.app}>
                        {this.navBar()}
                        {this.routing()}
                    </div>
                </Router>
            );
        } else {
            return <>still loading...</>;
        }
    }

    /**
     * render the top navigation bar
     */
    navBar(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();

        return (
            <div className={[style.navcontainer, themeStyle.backgroundcolor, themeStyle.textcolor, themeStyle.hrcolor].join(' ')}>
                <div className={style.navbrand}>{this.state.mediacentername}</div>
                <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/'} activeStyle={{opacity: '0.85'}}>
                    Home
                </NavLink>
                <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/random'} activeStyle={{opacity: '0.85'}}>
                    Random Video
                </NavLink>

                <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/categories'} activeStyle={{opacity: '0.85'}}>
                    Categories
                </NavLink>

                {GlobalInfos.isTVShowEnabled() ? (
                    <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/tvshows'} activeStyle={{opacity: '0.85'}}>
                        TV Shows
                    </NavLink>
                ) : null}

                <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/settings'} activeStyle={{opacity: '0.85'}}>
                    Settings
                </NavLink>
            </div>
        );
    }

    /**
     * render the react router elements
     */
    routing(): JSX.Element {
        return (
            <Switch>
                <Route path='/random'>
                    <RandomPage />
                </Route>
                <Route path='/categories'>
                    <CategoryPage />
                </Route>
                <Route path='/settings'>
                    <SettingsPage />
                </Route>
                <Route exact path='/player/:id'>
                    <Player />
                </Route>
                <Route exact path='/actors'>
                    <ActorOverviewPage />
                </Route>
                <Route path='/actors/:id'>
                    <ActorPage />
                </Route>

                {GlobalInfos.isTVShowEnabled() ? (
                    <Route path='/tvshows'>
                        <TVShowPage />
                    </Route>
                ) : null}

                {GlobalInfos.isTVShowEnabled() ? (
                    <Route exact path='/tvplayer/:id'>
                        <TVPlayer />
                    </Route>
                ) : null}

                <Route path='/'>
                    <HomePage />
                </Route>
            </Switch>
        );
    }
}

export default App;
