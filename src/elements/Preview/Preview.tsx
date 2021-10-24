import React from 'react';
import style from './Preview.module.css';
import {Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import GlobalInfos from '../../utils/GlobalInfos';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPhotoVideo} from '@fortawesome/free-solid-svg-icons';

interface PreviewProps {
    name: string;
    picLoader: (callback: (pic: string) => void) => void;
    linkPath?: string;
    onClick?: () => void;
    aspectRatio?: number;
}

interface PreviewState {
    picLoaded: boolean | null;
}

/**
 * Component for single preview tile
 * floating side by side
 */
class Preview extends React.Component<PreviewProps, PreviewState> {
    // store the picture to display
    pic?: string;

    static readonly DefMinWidth = 266;
    static readonly DefMaxWidth = 410;
    static readonly DefMinHeight = 150;
    static readonly DefMaxHeight = 400;

    constructor(props: PreviewProps) {
        super(props);

        this.state = {
            picLoaded: null
        };
    }

    componentDidMount(): void {
        this.props.picLoader((result) => {
            this.pic = result;
            this.setState({
                picLoaded: result !== ''
            });
        });
    }

    render(): JSX.Element {
        if (this.props.linkPath != null) {
            return <Link to={this.props.linkPath}>{this.content()}</Link>;
        } else {
            return this.content();
        }
    }

    content(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        const ratio = this.props.aspectRatio;
        let dimstyle = null;

        // check if aspect ratio is passed
        if (ratio != null) {
            // if ratio is <1 we need to calc height
            if (ratio < 1) {
                const height = Preview.DefMaxWidth * ratio;
                dimstyle = {height: height, width: Preview.DefMaxWidth};
            } else {
                const width = Preview.DefMaxHeight * ratio;
                dimstyle = {width: width, height: Preview.DefMaxHeight};
            }
        }

        return (
            <div
                className={style.videopreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}
                onClick={this.props.onClick}>
                <div
                    style={{maxWidth: dimstyle !== null ? dimstyle.width : Preview.DefMaxWidth}}
                    className={style.previewtitle + ' ' + themeStyle.lighttextcolor}>
                    {this.props.name}
                </div>
                <div style={dimstyle !== null ? dimstyle : undefined} className={style.previewpic}>
                    {this.state.picLoaded === false ? (
                        <FontAwesomeIcon
                            style={{
                                color: 'white',
                                marginTop: '55px'
                            }}
                            icon={faPhotoVideo}
                            size='5x'
                        />
                    ) : this.state.picLoaded === null ? (
                        <span className={style.loadAnimation}>
                            <Spinner animation='border' />
                        </span>
                    ) : (
                        <img
                            style={
                                dimstyle !== null
                                    ? dimstyle
                                    : {
                                          minWidth: Preview.DefMinWidth,
                                          maxWidth: Preview.DefMaxWidth,
                                          minHeight: Preview.DefMinHeight,
                                          maxHeight: Preview.DefMaxHeight
                                      }
                            }
                            src={this.pic}
                            alt='Pic loading.'
                        />
                    )}
                </div>
                <div className={style.previewbottom} />
            </div>
        );
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
