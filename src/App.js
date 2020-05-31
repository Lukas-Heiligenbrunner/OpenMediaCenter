import React from 'react';
import './App.css';
import MainBody from "./MainBody";
import AlternativeBody from "./AlternativeBody"
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
    page1click() {
        console.log("click page1");

        // rerender mainbody space here
        ReactDOM.render(
            <MainBody/>,
            document.getElementById("mainbody")
        );
    }

    page2click() {
        console.log("click page2");

        // rerender mainbody space here
        ReactDOM.render(
            <AlternativeBody/>,
            document.getElementById("mainbody")
        );
    }

    render() {
        return (
            <div className="App">
                <nav className="navbar navbar-expand-sm bg-primary navbar-dark">
                    <a className="navbar-brand" href="!#">Lukis Tube</a>

                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.homePageClick()} href="!#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.homePageClick()} href="!#">Random Video</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" onClick={() => this.homePageClick()} href="!#">Categories</a>
                        </li>
                    </ul>
                </nav>
                <div>
                    <button onClick={() => this.page1click()}>Page1</button>
                    <button onClick={() => this.page2click()}>Page2</button>
                </div>
                <div id="mainbody">
                    mimimimimi
                </div>

            </div>
        );
    }

    homePageClick() {
        console.log("click page1");

        // rerender mainbody space here
        ReactDOM.render(
            <MainBody/>,
            document.getElementById("mainbody")
        );
    }
}

export default App;
