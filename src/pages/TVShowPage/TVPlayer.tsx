import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {withRouter} from 'react-router-dom';
import PageTitle from '../../elements/PageTitle/PageTitle';
import style from '../Player/Player.module.css';
import {Plyr} from 'plyr-react';
import plyrstyle from 'plyr-react/dist/plyr.css';
import {DefaultPlyrOptions} from '../../types/GeneralTypes';
import {APINode, callAPI} from '../../utils/Api';
import GlobalInfos from '../../utils/GlobalInfos';
import PlyrJS from 'plyr';

interface Props extends RouteComponentProps<{id: string}> {}

interface State {
    loaded: boolean;
}

interface EpisodeData {
    Name: string;
    Season: number;
    Episode: number;
    TVShowID: number;
    Path: string;
}

class TVPlayer extends React.Component<Props, State> {
    state = {
        loaded: false
    };

    data: EpisodeData | null = null;

    componentDidMount(): void {
        this.loadVideo();
    }

    loadVideo(): void {
        callAPI(
            APINode.TVShow,
            {
                action: 'loadEpisode',
                ID: parseInt(this.props.match.params.id, 10)
            },
            (data: EpisodeData) => {
                console.log(data);
                this.data = data;
                this.setState({loaded: true});
            }
        );
    }

    assemblePlyrObject(): JSX.Element {
        if (this.state.loaded && this.data !== null) {
            const sources: PlyrJS.SourceInfo = {
                type: 'video',
                sources: [
                    {
                        src:
                            (process.env.REACT_APP_CUST_BACK_DOMAIN ? process.env.REACT_APP_CUST_BACK_DOMAIN : '') +
                            GlobalInfos.getTVShowPath() +
                            this.data.Path,
                        type: 'video/mp4',
                        size: 1080
                    }
                ],
                poster: ''
            };

            return <Plyr style={plyrstyle} source={sources} options={DefaultPlyrOptions} />;
        } else {
            return <div>not loaded yet</div>;
        }
    }

    render(): JSX.Element {
        return (
            <div id='videocontainer'>
                <PageTitle title='Watch' subtitle='todo' />

                <div className={style.videowrapper}>
                    {/* video component is added here */}
                    {this.assemblePlyrObject()}
                </div>
                <button className={style.closebutton} onClick={(): void => this.closebtn()}>
                    Close
                </button>
            </div>
        );
    }

    private closebtn(): void {
        this.props.history.goBack();
    }
}

export default withRouter(TVPlayer);
