import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import RandomPage from './pages/RandomPage/RandomPage';
import GlobalInfos from './utils/GlobalInfos';

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.module.css';

import SettingsPage from './pages/SettingsPage/SettingsPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import {APINode, apiTokenValid, callApiUnsafe, refreshAPIToken} from './utils/Api';
import {NoBackendConnectionPopup} from './elements/Popups/NoBackendConnectionPopup/NoBackendConnectionPopup';

import {BrowserRouter as Router, NavLink, Route, Switch} from 'react-router-dom';
import Player from './pages/Player/Player';
import ActorOverviewPage from './pages/ActorOverviewPage/ActorOverviewPage';
import ActorPage from './pages/ActorPage/ActorPage';
import {SettingsTypes} from './types/ApiTypes';
import AuthenticationPage from "./pages/AuthenticationPage/AuthenticationPage";

interface state {
    password: boolean | null; // null if uninitialized - true if pwd needed false if not needed
    mediacentername: string;
    onapierror: boolean;
}

/**
 * The main App handles the main tabs and which content to show
 */
class App extends React.Component<{}, state> {
    constructor(props: {}) {
        super(props);

        let pwdneeded: boolean | null = null;

        if (apiTokenValid()) {
            pwdneeded = false;
        } else {
            refreshAPIToken((err) => {
                if (err === 'invalid_client') {
                    this.setState({password: true})
                } else if (err === '') {
                    this.setState({password: false})
                } else {
                    console.log("unimplemented token error: " + err)
                }
            })
        }

        this.state = {
            mediacentername: 'OpenMediaCenter',
            onapierror: false,
            password: pwdneeded
        };

        GlobalInfos.onThemeChange(() => {
            this.forceUpdate();
        })
    }

    initialAPICall(): void {
        // this is the first api call so if it fails we know there is no connection to backend
        callApiUnsafe(APINode.Init, {action: 'loadInitialData'}, (result: SettingsTypes.initialApiCallData) => {
            // set theme
            GlobalInfos.enableDarkTheme(result.DarkMode);

            GlobalInfos.setVideoPath(result.VideoPath);

            this.setState({
                mediacentername: result.MediacenterName,
                onapierror: false
            });
            // set tab title to received mediacenter name
            document.title = result.MediacenterName;
        }, error => {
            this.setState({onapierror: true});
        });
    }

    componentDidMount(): void {
        this.initialAPICall();
    }


    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        // add the main theme to the page body
        document.body.className = themeStyle.backgroundcolor;

        if (this.state.password === true) {
            return (
                <AuthenticationPage submit={(password): void => {
                    refreshAPIToken((error) => {
                        if (error !== '') {
                            console.log("wrong password!!!");
                        } else {
                            this.setState({password: false});
                        }
                    }, password);
                }}/>
            );
        } else if (this.state.password === false) {
            return (
                <Router>
                    <div className={style.app}>
                        <div
                            className={[style.navcontainer, themeStyle.backgroundcolor, themeStyle.textcolor, themeStyle.hrcolor].join(' ')}>
                            <div className={style.navbrand}>{this.state.mediacentername}</div>
                            <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/'}
                                     activeStyle={{opacity: '0.85'}}>Home</NavLink>
                            <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/random'}
                                     activeStyle={{opacity: '0.85'}}>Random
                                Video</NavLink>

                            <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/categories'}
                                     activeStyle={{opacity: '0.85'}}>Categories</NavLink>
                            <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/settings'}
                                     activeStyle={{opacity: '0.85'}}>Settings</NavLink>
                        </div>
                        {this.routing()}
                    </div>
                    {this.state.onapierror ? this.ApiError() : null}
                </Router>
            );
        } else {
            return (<>still loading...</>);
        }
    }

    routing(): JSX.Element {
        return (
            <Switch>
                <Route path="/random">
                    <RandomPage/>
                </Route>
                <Route path="/categories">
                    <CategoryPage/>
                </Route>
                <Route path="/settings">
                    <SettingsPage/>
                </Route>
                <Route exact path="/player/:id">
                    <Player/>
                </Route>
                <Route exact path="/actors">
                    <ActorOverviewPage/>
                </Route>
                <Route path="/actors/:id">
                    <ActorPage/>
                </Route>
                <Route path="/">
                    <HomePage/>
                </Route>
            </Switch>
        );
    }

    ApiError(): JSX.Element {
        // on api error show popup and retry and show again if failing..
        return (<NoBackendConnectionPopup onHide={(): void => this.initialAPICall()}/>);
    }
}

export default App;
