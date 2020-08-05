import React from "react";
import style from "./Preview.module.css";
import Player from "../../pages/Player/Player";
import {Spinner} from "react-bootstrap";
import GlobalInfos from "../../GlobalInfos";

class Preview extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            previewpicture: null,
            name: null
        };
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
                    this.setState({
                        previewpicture: result
                    });
                }));
    }

    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={style.videopreview + ' ' + themeStyle.secbackground + ' '+ themeStyle.preview} onClick={() => this.itemClick()}>
                <div className={style.previewtitle + ' '+ themeStyle.lighttextcolor}>{this.state.name}</div>
                <div className={style.previewpic}>
                    {this.state.previewpicture !== null ?
                        <img className={style.previewimage}
                             src={this.state.previewpicture}
                             alt='Pic loading.'/> :
                        <span className={style.loadAnimation}><Spinner animation="border"/></span>}

                </div>
                <div className={style.previewbottom}>

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
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={style.videopreview + ' ' + style.tagpreview + ' ' + themeStyle.secbackground + ' '+ themeStyle.preview} onClick={() => this.itemClick()}>
                <div className={style.tagpreviewtitle + ' ' + themeStyle.lighttextcolor}>
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
