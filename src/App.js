import React from 'react';
import "./css/App.css"
import HomePage from "./pages/HomePage/HomePage";
import RandomPage from "./pages/RandomPage/RandomPage";

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';
import SettingsPage from "./pages/SettingsPage/SettingsPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import {Spinner} from "react-bootstrap";
import LoginPage from "./pages/LoginPage/LoginPage";

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {page: "unverified"};

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
            page = <CategoryPage viewbinding={{showVideo: this.showVideo, hideVideo: this.hideVideo}}/>;
            this.mypage = page;
        } else if (this.state.page === "video") {
            // show videoelement if neccessary
            page = this.videoelement;

            console.log(page);
        } else if (this.state.page === "lastpage") {
            // return back to last page
            page = this.mypage;
        } else if (this.state.page === "loginpage") {
            // return back to last page
            page = <LoginPage/>;
        } else if (this.state.page === "unverified") {
            // return back to last page
            page =
                <div className='loadSpinner'>
                    <Spinner style={{marginLeft: "40px", marginBottom: "20px"}} animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <div>Content loading...</div>
                </div>;
        } else {
            page = <div>unimplemented yet!</div>;
        }
        return (page);
    }

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append("action", "isPasswordNeeded");

        fetch('/api/settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                        if (result.password === false) {
                            this.setState({page: "default"});
                        } else {
                            this.setState({page: "loginpage"});
                        }
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
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
        this.videoelement = element;

        this.setState({
            page: "video"
        });
    }

    hideVideo() {
        this.setState({
            page: "lastpage"
        });
        this.element = null;
    }
}

export default App;
