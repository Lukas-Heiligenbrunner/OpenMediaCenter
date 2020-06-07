import React from 'react';
import "./css/App.css"
import HomePage from "./pages/HomePage";
import RandomPage from "./pages/RandomPage";

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from "./pages/SettingsPage";
import CategoryPage from "./pages/CategoryPage";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {page: "default"};

        // bind this to the method for being able to call methods such as this.setstate
        this.showVideo = this.showVideo.bind(this);
        this.hideVideo = this.hideVideo.bind(this);
    }

    videoelement = null;

    MainBody() {
        let page;
        if (this.state.page === "default") {
            page = <HomePage viewbinding={{showVideo: this.showVideo, hideVideo: this.hideVideo}}/>;
            this.mypage = page;
        } else if (this.state.page === "random") {
            page = <RandomPage viewbinding={{showVideo: this.showVideo, hideVideo: this.hideVideo}}/>;
            this.mypage = page;
        } else if (this.state.page === "settings") {
            page = <SettingsPage/>;
            this.mypage = page;
        } else if (this.state.page === "categories") {
            page = <CategoryPage/>;
            this.mypage = page;
        } else if (this.state.page === "video") {
            // show videoelement if neccessary
            page = this.videoelement;
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
                {this.MainBody()}
            </div>
        );
    }

    showVideo(element) {
        this.setState({
            page: "video"
        });

        this.videoelement = element;
    }

    hideVideo() {
        this.setState({
            page: "lastpage"
        });
        this.element = null;
    }
}

export default App;
