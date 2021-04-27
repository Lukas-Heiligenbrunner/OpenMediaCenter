import React from 'react';
import style from './Preview.module.css';
import {Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import GlobalInfos from '../../utils/GlobalInfos';
import {APINode, callAPIPlain} from '../../utils/Api';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPhotoVideo} from '@fortawesome/free-solid-svg-icons';

interface PreviewProps {
    name: string;
    movieId: number;
}

interface PreviewState {
    previewpicture: string | null;
}

/**
 * Component for single preview tile
 * floating side by side
 */
class Preview extends React.Component<PreviewProps, PreviewState> {
    constructor(props: PreviewProps) {
        super(props);

        this.state = {
            previewpicture: null
        };
    }

    componentDidMount(): void {
        callAPIPlain(APINode.Video, {action: 'readThumbnail', movieid: this.props.movieId}, (result) => {
            this.setState({
                previewpicture: result
            });
        });
    }

    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <Link to={'/player/' + this.props.movieId}>
                <div className={style.videopreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}>
                    <div className={style.previewpic}>{this.renderPic()}</div>
                    <div className={style.previewText + ' ' + themeStyle.lighttextcolor}>{this.props.name}</div>
                </div>
            </Link>
        );
    }

    private renderPic(): JSX.Element {
        if (this.state.previewpicture === '') {
            return (
                <FontAwesomeIcon
                    style={{
                        color: 'white',
                        marginTop: '55px'
                    }}
                    icon={faPhotoVideo}
                    size='5x'
                />
            );
        } else if (this.state.previewpicture === null) {
            return (
                <span className={style.loadAnimation}>
                    <Spinner animation='border' />
                </span>
            );
        } else {
            return <img className={style.previewimage} src={this.state.previewpicture} alt='Pic loading.' />;
        }
    }
}

/**
 * Component for a Tag-name tile (used in category page)
 */
export class TagPreview extends React.Component<{name: string}> {
    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={style.videopreview + ' ' + style.tagpreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}>
                <div className={style.tagpreviewtitle + ' ' + themeStyle.lighttextcolor}>{this.props.name}</div>
            </div>
        );
    }
}

export default Preview;
