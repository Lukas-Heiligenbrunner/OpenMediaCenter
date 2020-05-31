import React from "react";
import "./css/Preview.css"
import ReactDOM from "react-dom";
import Player from "./Player";

class Preview extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.props = props;

        this.state = {
            previewpicture: null,
            name: null
        };
    }

    componentWillUnmount() {
        this.setState({});
    }

    componentDidMount() {
        this.setState({
            previewpicture: null,
            name: this.props.name
        });

        const updateRequest = new FormData();
        updateRequest.append('action', 'readThumbnail');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/php/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.text())
            .then((result) => {
                this.setState(prevState => ({
                    ...prevState.previewpicture, previewpicture: result
                }));
            });
    }

    render() {
        return (
            <div className='videopreview' onClick={() => this.itemClick()}>
                <div className='previewtitle'>{this.state.name}</div>
                <div className='previewpic'>
                    <img className='previewimage'
                         src={this.state.previewpicture}
                         alt='no thumbnail found'/>
                </div>
            </div>
        );
    }

    itemClick() {
        console.log("item clicked!"+this.state.name);

        ReactDOM.render(
            <React.StrictMode>
                <Player movie_id={this.props.movie_id}/>
            </React.StrictMode>,
            document.getElementById('root')
        );
    }
}

export default Preview;
