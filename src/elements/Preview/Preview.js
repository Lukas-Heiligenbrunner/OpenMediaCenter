import React from 'react';
import style from './Preview.module.css';
import Player from '../../pages/Player/Player';
import {Spinner} from 'react-bootstrap';
import GlobalInfos from '../../GlobalInfos';
import {Link} from 'react-router-dom';

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
        this.setState({
            previewpicture: null,
            name: this.props.name
        });

        const updateRequest = new FormData();
        updateRequest.append('action', 'readThumbnail');
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/video.php', {method: 'POST', body: updateRequest})
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
            <Link to={"/player/"+this.props.movie_id}>
                <div className={style.videopreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}>
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
            </Link>

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
                className={style.videopreview + ' ' + style.tagpreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}>
                <div className={style.tagpreviewtitle + ' ' + themeStyle.lighttextcolor}>
                    {this.props.name}
                </div>
            </div>
        );
    }
}

export default Preview;
