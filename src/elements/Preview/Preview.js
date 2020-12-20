import React from 'react';
import style from './Preview.module.css';
import {Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
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
