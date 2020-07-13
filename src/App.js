import React from 'react';
import "./App.css"
import HomePage from "./pages/HomePage/HomePage";
import RandomPage from "./pages/RandomPage/RandomPage";

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: "default",
            generalSettingsLoaded: false,
            passwordsupport: null
        };

        // bind this to the method for being able to call methods such as this.setstate
        this.changeRootElement = this.changeRootElement.bind(this);
        this.returnToLastElement = this.returnToLastElement.bind(this);
    }

    generaldata = {};

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadInitialData');

        fetch('/api/Settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.generaldata = {
                        videopath: result.video_path,
                        tvshowpath: result.episode_path,
                        mediacentername: result.mediacenter_name
                    };

                    this.setState({
                        generalSettingsLoaded: true,
                        passwordsupport: result.passwordEnabled
                    });
                }));
    }

    newElement = null;

    constructViewBinding(){
        return {
            changeRootElement: this.changeRootElement,
            returnToLastElement: this.returnToLastElement,
            generalsettings: this.generaldata
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
        return (
            <div className="App">
                <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                    <div className="navbar-brand">OpenMediaCenter</div>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "default" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.setState({page: "default"})}>Home
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "random" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.setState({page: "random"})}>Random Video
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "categories" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.setState({page: "categories"})}>Categories
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "settings" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.setState({page: "settings"})}>Settings
                            </div>
                        </li>
                    </ul>
                </nav>
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
