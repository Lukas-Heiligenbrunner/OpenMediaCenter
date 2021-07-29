import React from 'react';
import style from './Preview.module.css';
import {Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import GlobalInfos from '../../utils/GlobalInfos';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPhotoVideo} from '@fortawesome/free-solid-svg-icons';
import {faEllipsisV} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import QuickActionPop from '../QuickActionPop/QuickActionPop';
import {APINode, callAPIPlain} from '../../utils/Api';

interface PreviewProps {
    name: string;
    picLoader: (callback: (pic: string) => void) => void;
    linkPath?: string;
    onClick?: () => void;
}

interface PreviewState {
    picLoaded: boolean | null;
    optionsvisible: boolean;
}

/**
 * Component for single preview tile
 * floating side by side
 */
class Preview extends React.Component<PreviewProps, PreviewState> {
    // store the picture to display
    pic?: string;

    constructor(props: PreviewProps) {
        super(props);

        this.state = {
            picLoaded: null,
            optionsvisible: false
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
        if (this.props.linkPath !== undefined) {
            return <Link to={this.props.linkPath}>{this.content()}</Link>;
        } else {
            return this.content();
        }
    }

    content(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div
                className={style.videopreview + ' ' + themeStyle.secbackground + ' ' + themeStyle.preview}
                onClick={this.props.onClick}>
                <div className={style.quickactions} onClick={(): void => this.setState({optionsvisible: true})}>
                    <FontAwesomeIcon style={{
                        verticalAlign: 'middle',
                        fontSize: '25px'
                    }} icon={faEllipsisV} size='1x'/>
                </div>
                {this.popupvisible()}
                <div className={style.previewtitle + ' ' + themeStyle.lighttextcolor}>{this.props.name}</div>
                <div className={style.previewpic}>
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
                        <img className={style.previewimage} src={this.pic} alt='Pic loading.' />
                    )}
                </div>
                <div className={style.previewbottom} />
            </div>
        );
    }

    popupvisible(): JSX.Element {
        if (this.state.optionsvisible)
            return (<QuickActionPop position={{x: 50, y: 50}} onHide={(): void => this.setState({optionsvisible: false})}>heeyyho</QuickActionPop>);
        else
            return <></>;
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
