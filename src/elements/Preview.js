import React from "react";
import "../css/Preview.css";
import Player from "../pages/Player";

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

        fetch('/api/videoload.php', {method: 'POST', body: updateRequest})
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
                <div className='previewtitle videopreviewtitle'>{this.state.name}</div>
                <div className='previewpic'>
                    <img className='previewimage'
                         src={this.state.previewpicture}
                         alt='Pic loading.'/>
                </div>
                <div className='previewbottom'>

                </div>
            </div>
        );
    }

    itemClick() {
        console.log("item clicked!" + this.state.name);

        this.props.viewbinding.showVideo(<Player
            viewbinding={this.props.viewbinding}
            movie_id={this.props.movie_id}/>);
    }
}

export class TagPreview extends React.Component {
    constructor(props: P, context: any) {
        super(props, context);

        this.props = props;

        this.state = {
            thumbnail: null
        };
    }

    componentDidMount() {
        this.loadPreview();
    }


    render() {
        return (
            <div className='videopreview' onClick={() => this.itemClick()}>
                <div className='previewtitle tagpreviewtitle'>{this.props.name}</div>
                <div className='previewpic'>
                    <img className='previewimage'
                         src={this.state.thumbnail}
                         alt='Pic loading.'/>
                </div>
                <div className='previewbottom'>

                </div>
            </div>
        );
    }

    loadPreview() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'getRandomTagPreview');
        updateRequest.append('id', this.props.tag_id);

        fetch('/api/Tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.text())
            .then((result) => {
                this.setState({thumbnail: result});
            });
    }
}

export default Preview;
