import React from 'react';
import style from './Preview.module.css';
import Player from '../../pages/Player/Player';
import {Spinner} from 'react-bootstrap';
import GlobalInfos from '../../utils/GlobalInfos';
import {callAPIPlain} from '../../utils/Api';

/**
 * Component for single preview tile
 * floating side by side
 */
class Preview extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            previewpicture: null,
            name: null
        };
    }

    componentDidMount() {
        callAPIPlain('video.php', {action: 'readThumbnail', movieid: this.props.movie_id}, (result) => {
            this.setState({
                previewpicture: result,
                name: this.props.name
            });
        });
    }

    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={style.videopreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}
                 onClick={() => this.itemClick()}>
                <div className={style.previewtitle + ' ' + themeStyle.lighttextcolor}>{this.state.name}</div>
                <div className={style.previewpic}>
                    {this.state.previewpicture !== null ?
                        <img className={style.previewimage}
                             src={this.state.previewpicture}
                             alt='Pic loading.'/> :
                        <span className={style.loadAnimation}><Spinner animation='border'/></span>}

                </div>
                <div className={style.previewbottom}>

                </div>
            </div>
        );
    }

    /**
     * handle the click event of a tile
     */
    itemClick() {
        console.log('item clicked!' + this.state.name);

        GlobalInfos.getViewBinding().changeRootElement(
            <Player movie_id={this.props.movie_id}/>);
    }
}

/**
 * Component for a Tag-name tile (used in category page)
 */
export class TagPreview extends React.Component {
    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div
                className={style.videopreview + ' ' + style.tagpreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}
                onClick={() => this.itemClick()}>
                <div className={style.tagpreviewtitle + ' ' + themeStyle.lighttextcolor}>
                    {this.props.name}
                </div>
            </div>
        );
    }

    /**
     * handle the click event of a Tag tile
     */
    itemClick() {
        this.props.categorybinding(this.props.name);
    }
}

export default Preview;
