import React from "react";
import Preview from "./Preview";
import './css/video.css'

class HomePage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: null
        };
    }

    componentDidMount() {
        // todo check if better here or in constructor
        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');

        // fetch all videos available
        fetch('/php/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                this.setState({data: result});
            });
    }

    componentWillUnmount() {
        this.setState({});
    }

    render() {
        return (
            <div>
                <div><h1>Home page</h1></div>
                {this.state.data ? this.loadPreviewBlock(12) : <div>not loaded yet</div>}
            </div>
        );
    }

    loadPreview(index) {
        return (
            <Preview
                key={index}
                name={this.state.data[index].movie_name}
                movie_id={this.state.data[index].movie_id}/>
            );
    }

    loadPreviewBlock(nr) {
        let ret = [];
        for (let i = 0; i < nr; i++) {
            ret.push(this.loadPreview(i));
        }
        return (ret);
    }
}

export default HomePage;
