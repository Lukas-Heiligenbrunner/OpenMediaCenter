import React from 'react';
import HomePage from './pages/HomePage/HomePage';
import RandomPage from './pages/RandomPage/RandomPage';
import GlobalInfos from './utils/GlobalInfos';

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.module.css';

import SettingsPage from './pages/SettingsPage/SettingsPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import {callAPI} from './utils/Api';
import {NoBackendConnectionPopup} from './elements/Popups/NoBackendConnectionPopup/NoBackendConnectionPopup';

import {BrowserRouter as Router, NavLink, Route, Switch} from 'react-router-dom';
import Player from './pages/Player/Player';

/**
 * The main App handles the main tabs and which content to show
 */
class App extends React.Component {
    newElement = null;

    constructor(props, context) {
        super(props, context);
        this.state = {
            page: '/',
            generalSettingsLoaded: false,
            passwordsupport: null,
            mediacentername: 'OpenMediaCenter',
            onapierror: false
        };

        // bind this to the method for being able to call methods such as this.setstate
        // this.changeRootElement = this.changeRootElement.bind(this);
        // this.returnToLastElement = this.returnToLastElement.bind(this);

        // // set the main navigation viewbinding to the singleton
        // GlobalInfos.setViewBinding(this.constructViewBinding());
    }

    initialAPICall(){
        // this is the first api call so if it fails we know there is no connection to backend
        callAPI('settings.php', {action: 'loadInitialData'}, (result) =>{
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
        }, error =>  {
            this.setState({onapierror: true});
        });
    }

    componentDidMount() {
        this.initialAPICall();
    }

    // /**
    //  * create a viewbinding to call APP functions from child elements
    //  * @returns a set of callback functions
    //  */
    // constructViewBinding() {
    //     return {
    //         changeRootElement: this.changeRootElement,
    //         returnToLastElement: this.returnToLastElement
    //     };
    // }

    // /**
    //  * load the selected component into the main view
    //  * @returns {JSX.Element} body element of selected page
    //  */
    // MainBody() {
    //     let page;
    //     if (this.state.page === 'default') {
    //         page = <HomePage/>;
    //         this.mypage = page;
    //     } else if (this.state.page === 'random') {
    //         page = <RandomPage/>;
    //         this.mypage = page;
    //     } else if (this.state.page === 'settings') {
    //         page = <SettingsPage/>;
    //         this.mypage = page;
    //     } else if (this.state.page === 'categories') {
    //         page = <CategoryPage/>;
    //         this.mypage = page;
    //     } else if (this.state.page === 'video') {
    //         // show videoelement if neccessary
    //         page = this.newElement;
    //
    //         console.log(page);
    //     } else if (this.state.page === 'lastpage') {
    //         // return back to last page
    //         page = this.mypage;
    //     } else {
    //         page = <div>unimplemented yet!</div>;
    //     }
    //     return (page);
    // }


    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        // add the main theme to the page body
        document.body.className = themeStyle.backgroundcolor;

        return (
            <Router>
                <div className={style.app}>
                    <div className={[style.navcontainer, themeStyle.backgroundcolor, themeStyle.textcolor, themeStyle.hrcolor].join(' ')}>
                        <div className={style.navbrand}>{this.state.mediacentername}</div>

                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/'} activeStyle={{ opacity: '0.85' }}>Home</NavLink>
                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/random'} activeStyle={{ opacity: '0.85' }}>Random Video</NavLink>

                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/categories'} activeStyle={{ opacity: '0.85' }}>Categories</NavLink>
                        <NavLink className={[style.navitem, themeStyle.navitem].join(' ')} to={'/settings'} activeStyle={{ opacity: '0.85' }}>Settings</NavLink>
                    </div>
                    {/*<Redirect to={this.state.page}/>*/}
                    {this.routing()}
                </div>
                {this.state.onapierror ? this.ApiError() : null}
            </Router>
        );
    }

    routing() {
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
                <Route path="/player/:id">
                    <Player/>
                </Route>
                <Route exact path="/">
                    <HomePage/>
                </Route>
            </Switch>
        );
    }

    // /**
    //  * render a new root element into the main body
    //  */
    // changeRootElement(element) {
    //     this.newElement = element;
    //
    //     this.setState({
    //         page: 'video'
    //     });
    // }
    //
    // /**
    //  * return from page to the previous page before a change
    //  */
    // returnToLastElement() {
    //     this.setState({
    //         page: 'lastpage'
    //     });
    // }

    ApiError() {
        // on api error show popup and retry and show again if failing..
        return (<NoBackendConnectionPopup onHide={() => this.initialAPICall()}/>);
    }
}

export default App;
