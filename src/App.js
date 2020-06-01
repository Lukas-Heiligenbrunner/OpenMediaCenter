import React from 'react';
import MainBody from "./MainBody";
import "./css/App.css"

// include bootstraps css
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {page: "default"};

        // bind this to the method for being able to call methods such as this.setstate
        this.showVideo = this.showVideo.bind(this);
        this.hideVideo = this.hideVideo.bind(this);
    }

    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                    <div className="navbar-brand">Lukis Tube</div>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "default" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.loadHomePage()}>Home
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "random" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.loadRandomPage()}>Random Video
                            </div>
                        </li>
                        <li className="nav-item">
                            <div className="nav-link"
                                 style={this.state.page === "categories" ? {color: "rgba(255,255,255,.75"} : {}}
                                 onClick={() => this.loadCategoriesPage()}>Categories
                            </div>
                        </li>
                    </ul>
                </nav>
                <MainBody viewbinding={{showVideo: this.showVideo, hideVideo: this.hideVideo}} page={this.state.page}
                          videoelement={this.element}/>
            </div>
        );
    }

    loadCategoriesPage() {
        console.log("click categories");
        this.setState({page: "categories"});
    }

    loadRandomPage() {
        console.log("click random");
        this.setState({page: "random"});
    }

    loadHomePage() {
        console.log("click default");
        this.setState({page: "default"});
    }

    showVideo(element) {
        this.setState({
            page: "video"
        });

        this.element = element;
    }

    hideVideo() {
        this.setState({
            page: "default"
        });
        this.element = null;
    }
}

export default App;
