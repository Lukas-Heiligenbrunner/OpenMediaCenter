import React from "react";
import Preview from "./Preview";
import './css/video.css'

class HomePage extends React.Component {
    // stores all available movies
    data = null;
    // stores current index of loaded elements
    loadindex = 0;

    constructor(props, context) {
        super(props, context);

        this.state = {
            loadeditems: []
        };
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);

        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');

        // fetch all videos available
        fetch('/php/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                this.data = result;
                this.loadPreviewBlock(12);
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
                {this.state.loadeditems.map(elem => (
                    <Preview
                        name={elem.movie_name}
                        movie_id={elem.movie_id}
                        showvideo={this.props.showvideo}/>
                ))}
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
