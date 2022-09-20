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
}

interface Episode {
    ID: number;
    Name: string;
    Season: number;
    Episode: number;
}

export class EpisodePage extends React.Component<Props, State> {
    episodes: Episode[] = [];

    state = {
        loaded: false
    };

    componentDidMount(): void {
        callAPI(APINode.TVShow, {action: 'getEpisodes', ShowID: parseInt(this.props.match.params.id, 10)}, (episodes: Episode[]) => {
            this.episodes = episodes;
            this.setState({loaded: true});
        });
    }

    render(): JSX.Element {
        if (!this.state.loaded) {
            return <>loading...</>;
        }

        return (
            <>
                <PageTitle title='TV Shows' subtitle='' />
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
        <Link to={'/media/tvplayer/' + props.episode.ID}>
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
