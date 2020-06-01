import React, {useState} from "react";
import Preview from "./Preview";
import "./css/HomePage.css"

class HomePage extends React.Component {
    // stores all available movies
    data = null;
    // stores current index of loaded elements
    loadindex = 0;

    constructor(props, context) {
        super(props, context);

        this.state = {
            loadeditems: [],
            sideinfo: {
                videonr: null,
                hdvideonr: null,
                sdvideonr: null,
                categorynr: null
            }
        };
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);

        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');

        // fetch all videos available
        fetch('/php/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.data = result;
                    this.loadPreviewBlock(12);
                }))
            .catch(() => {
                console.log("no connection to backend");
            });


    }

    componentWillUnmount() {
        this.setState({});
        document.removeEventListener('scroll', this.trackScrolling);
    }

    render() {
        return (
            <div>
                <div><h1>Home page</h1></div>
                <div className='sideinfo'>
                    Infos:
                    <div>Total Number of Videos: {this.state.sideinfo.videonr}</div>
                    <div>HD Videos: {this.state.sideinfo.hdvideonr}</div>
                    <div>SD Videos: {this.state.sideinfo.sdvideonr}</div>
                    <div>Total Number of Categories: {this.state.sideinfo.categorynr}</div>
                </div>
                <div className='maincontent'>
                    {this.state.loadeditems.map(elem => (
                        <Preview
                            key={elem.movie_id}
                            name={elem.movie_name}
                            movie_id={elem.movie_id}
                            viewbinding={this.props.viewbinding}/>
                    ))}
                </div>
                <div className='rightinfo'>

                </div>

            </div>
        );
    }

    loadPreviewBlock(nr) {
        console.log("loadpreviewblock called ...")
        let ret = [];
        for (let i = 0; i < nr; i++) {
            // only add if not end
            if (this.data.length > this.loadindex + i) {
                ret.push(this.data[this.loadindex + i]);
            }
        }

        this.setState({
            loadeditems: [
                ...this.state.loadeditems,
                ...ret
            ]
        });


        this.loadindex += nr;
    }

    trackScrolling = (e) => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            this.loadPreviewBlock(6);
        }
    }
}

export default HomePage;