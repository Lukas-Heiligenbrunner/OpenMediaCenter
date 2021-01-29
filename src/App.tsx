import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import RandomPage from './pages/RandomPage/RandomPage';
import GlobalInfos from './utils/GlobalInfos';

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.module.css';

import SettingsPage from './pages/SettingsPage/SettingsPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import {APINode, callAPI} from './utils/Api';
import {NoBackendConnectionPopup} from './elements/Popups/NoBackendConnectionPopup/NoBackendConnectionPopup';

import {BrowserRouter as Router, NavLink, Route, Switch} from 'react-router-dom';
import Player from './pages/Player/Player';
import ActorOverviewPage from './pages/ActorOverviewPage/ActorOverviewPage';
import ActorPage from './pages/ActorPage/ActorPage';
import {SettingsTypes} from './types/ApiTypes';

interface state {
    generalSettingsLoaded: boolean;
    passwordsupport: boolean;
    mediacentername: string;
    onapierror: boolean;
}

/**
 * The main App handles the main tabs and which content to show
 */
class App extends React.Component<{}, state> {
    constructor(props: {}) {
        super(props);
        this.state = {
            generalSettingsLoaded: false,
            passwordsupport: false,
            mediacentername: 'OpenMediaCenter',
            onapierror: false
        };
    }

    initialAPICall(): void {
        // this is the first api call so if it fails we know there is no connection to backend
        callAPI(APINode.Settings, {action: 'loadInitialData'}, (result: SettingsTypes.initialApiCallData) => {
            // set theme
            GlobalInfos.enableDarkTheme(result.DarkMode);

            this.setState({
                generalSettingsLoaded: true,
                passwordsupport: result.passwordEnabled,
                mediacentername: result.mediacenter_name,
                onapierror: false
            });
            // set tab title to received mediacenter name
            document.title = result.mediacenter_name;
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

        return (
            <Router>
                <div className={style.app}>
                    <div className={[style.navcontainer, themeStyle.backgroundcolor, themeStyle.textcolor, themeStyle.hrcolor].join(' ')}>
                        <div className={style.navbrand}>{this.state.mediacentername}</div>
                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/'} activeStyle={{opacity: '0.85'}}>Home</NavLink>
                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/random'} activeStyle={{opacity: '0.85'}}>Random
                            Video</NavLink>

                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/categories'} activeStyle={{opacity: '0.85'}}>Categories</NavLink>
                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/settings'} activeStyle={{opacity: '0.85'}}>Settings</NavLink>
                    </div>
                    {this.routing()}
                </div>
                {this.state.onapierror ? this.ApiError() : null}
            </Router>
        );
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
