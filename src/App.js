import React from 'react';
import MainBody from "./MainBody";

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
                    <a className="navbar-brand" href="!#">Lukis Tube</a>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.loadHomePage()} href='# '>Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.loadRandomPage()} href="# ">Random Video</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.loadCategoriesPage()} href="# ">Categories</a>
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
