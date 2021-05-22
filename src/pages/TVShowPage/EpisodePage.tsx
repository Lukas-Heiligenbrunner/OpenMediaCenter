import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {withRouter} from 'react-router-dom';
import {APINode, callAPI} from '../../utils/Api';
import {Link} from 'react-router-dom';
import DynamicContentContainer from '../../elements/DynamicContentContainer/DynamicContentContainer';
import tileStyle from './EpisodeTile.module.css';
import GlobalInfos from '../../utils/GlobalInfos';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';

interface Props extends RouteComponentProps<{id: string}> {}

interface State {
    loaded: boolean;
    error: number;
    Showname: string;
}

interface Episode {
    ID: number;
    Name: string;
    Season: number;
    Episode: number;
}

interface EpisodeData {
    error: number;
    episodes: Episode[];
    ShowName: string;
}

export class EpisodePage extends React.Component<Props, State> {
    episodes: Episode[] = [];

    state = {
        loaded: false,
        error: 0,
        Showname: ''
    };

    componentDidMount(): void {
        callAPI(APINode.TVShow, {action: 'getEpisodes', ShowID: parseInt(this.props.match.params.id, 10)}, (data: EpisodeData) => {
            if (data.error !== 0) {
                this.setState({error: data.error, loaded: true});
            } else {
                this.episodes = data.episodes;
                this.setState({loaded: true, Showname: data.ShowName});
            }
        });
    }

    render(): JSX.Element {
        // check if content is loaded
        if (!this.state.loaded) {
            return <>loading...</>;
        }

        // check if there is an error to display
        if (this.state.error !== 0) {
            return <>Error code: {this.state.error}</>;
        }

        return (
            <>
                <PageTitle title={this.state.Showname} subtitle={this.episodes.length + ' Episodes'} />
                <SideBar>
                    <SideBarTitle>Infos:</SideBarTitle>
                    <Line />
                    <SideBarItem>
                        <b>{this.episodes.length}</b> Episodes Total!
                    </SideBarItem>
                </SideBar>
                <DynamicContentContainer
                    renderElement={(el): JSX.Element => <EpisodeTile key={el.ID} episode={el} />}
                    data={this.episodes}
                    initialLoadNr={-1}
                />
            </>
        );
    }
}

export const EpisodeTile = (props: {episode: Episode}): JSX.Element => {
    const themestyle = GlobalInfos.getThemeStyle();
    return (
        <Link to={'/tvplayer/' + props.episode.ID}>
            <div className={tileStyle.tile + ' ' + themestyle.secbackground + ' ' + themestyle.textcolor}>
                <FontAwesomeIcon
                    style={{
                        marginRight: '10px'
                    }}
                    icon={faPlay}
                    size='1x'
                />
                Season: {props.episode.Season} Episode: {props.episode.Episode} {props.episode.Name}
            </div>
        </Link>
    );
};

export default withRouter(EpisodePage);
