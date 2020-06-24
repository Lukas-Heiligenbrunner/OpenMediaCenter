import React from "react";
import "./Preview.css";
import Player from "../../pages/Player/Player";
import {Spinner} from "react-bootstrap";

class Preview extends React.Component {
    constructor(props, context) {
        super(props, context);

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

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
            .then((response) => response.text()
                .then((result) => {
                    this.setState(prevState => ({
                        ...prevState.previewpicture, previewpicture: result
                    }));
                }));
    }

    render() {
        return (
            <div className='videopreview' onClick={() => this.itemClick()}>
                <div className='previewtitle'>{this.state.name}</div>
                <div className='previewpic'>
                    {this.state.previewpicture != null ?
                        <img className='previewimage'
                             src={this.state.previewpicture}
                             alt='Pic loading.'/> :
                        <span className='loadAnimation'><Spinner animation="border"/></span>}

                </div>
                <div className='previewbottom'>

                </div>
            </div>
        );
    }

    itemClick() {
        console.log("item clicked!" + this.state.name);

        this.props.viewbinding.changeRootElement(
            <Player
                viewbinding={this.props.viewbinding}
                movie_id={this.props.movie_id}/>);
    }
}

export class TagPreview extends React.Component {
    render() {
        return (
            <div className='videopreview tagpreview' onClick={() => this.itemClick()}>
                <div className='tagpreviewtitle'>
                    {this.props.name}
                </div>
            </div>
        );
    }

    itemClick() {
        this.props.categorybinding(this.props.name);
    }
}

export default Preview;
