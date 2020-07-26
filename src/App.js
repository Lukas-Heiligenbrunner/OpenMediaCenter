import React from 'react';
import HomePage from "./pages/HomePage/HomePage";
import RandomPage from "./pages/RandomPage/RandomPage";
import StaticInfos from "./GlobalInfos";

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './App.module.css'
import lighttheme from './AppLightTheme.module.css'
import darktheme from './AppDarkTheme.module.css'

import SettingsPage from "./pages/SettingsPage/SettingsPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: "default",
            generalSettingsLoaded: false,
            passwordsupport: null,
            mediacentername: "OpenMediaCenter"
        };

        // bind this to the method for being able to call methods such as this.setstate
        this.changeRootElement = this.changeRootElement.bind(this);
        this.returnToLastElement = this.returnToLastElement.bind(this);
    }

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadInitialData');

        fetch('/api/Settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    console.log(result);
                    this.setState({
                        generalSettingsLoaded: true,
                        passwordsupport: result.passwordEnabled,
                        mediacentername: result.mediacenter_name
                    });
                    console.log(this.state);
                }));
    }

    newElement = null;

    constructViewBinding() {
        return {
            changeRootElement: this.changeRootElement,
            returnToLastElement: this.returnToLastElement
        };
    }

    MainBody() {
        let page;
        if (this.state.page === "default") {
            page = <HomePage viewbinding={this.constructViewBinding()}/>;
            this.mypage = page;
        } else if (this.state.page === "random") {
            page = <RandomPage viewbinding={this.constructViewBinding()}/>;
            this.mypage = page;
        } else if (this.state.page === "settings") {
            page = <SettingsPage/>;
            this.mypage = page;
        } else if (this.state.page === "categories") {
            page = <CategoryPage viewbinding={this.constructViewBinding()}/>;
            this.mypage = page;
        } else if (this.state.page === "video") {
            // show videoelement if neccessary
            page = this.newElement;

            console.log(page);
        } else if (this.state.page === "lastpage") {
            // return back to last page
            page = this.mypage;
        } else {
            page = <div>unimplemented yet!</div>;
        }
        return (page);
    }

    render() {
        const themeStyle = StaticInfos.isDarkTheme() ? darktheme : lighttheme;
        // add the main theme to the page body
        document.body.className += ' ' + themeStyle.backgroundcolor;
        return (
            <div className="App">
                <div className={[style.navcontainer, themeStyle.backgroundcolor, themeStyle.textcolor, themeStyle.hrcolor].join(' ')}>
                    <div className={style.navbrand}>{this.state.mediacentername}</div>

                    <div className={[style.navitem, themeStyle.navitem, this.state.page === "default" ? style.navitemselected : {}].join(' ')}
                         onClick={() => this.setState({page: "default"})}>Home
                    </div>
                    <div className={[style.navitem, themeStyle.navitem, this.state.page === "random" ? style.navitemselected : {}].join(' ')}
                         onClick={() => this.setState({page: "random"})}>Random Video
                    </div>
                    <div className={[style.navitem, themeStyle.navitem, this.state.page === "categories" ? style.navitemselected : {}].join(' ')}
                         onClick={() => this.setState({page: "categories"})}>Categories
                    </div>
                    <div className={[style.navitem, themeStyle.navitem, this.state.page === "settings" ? style.navitemselected : {}].join(' ')}
                         onClick={() => this.setState({page: "settings"})}>Settings
                    </div>
                </div>
                {this.state.generalSettingsLoaded ? this.MainBody() : "loading"}
            </div>
        );
    }

    changeRootElement(element) {
        this.newElement = element;

        this.setState({
            page: "video"
        });
    }

    returnToLastElement() {
        this.setState({
            page: "lastpage"
        });
    }
}

export default App;
