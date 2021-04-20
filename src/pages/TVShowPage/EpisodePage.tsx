import * as React from 'react';
import {RouteComponentProps} from 'react-router';
import {withRouter} from 'react-router-dom';
import {APINode, callAPI} from '../../utils/Api';
import {Link} from 'react-router-dom';
import DynamicContentContainer from '../../elements/DynamicContentContainer/DynamicContentContainer';

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

class EpisodePage extends React.Component<Props, State> {
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
                <DynamicContentContainer
                    renderElement={(el): JSX.Element => <EpisodeTile key={el.ID} episode={el} />}
                    data={this.episodes}
                />
            </>
        );
    }
}

const EpisodeTile = (props: {episode: Episode}): JSX.Element => {
    return (
        <Link to={'/tvplayer/' + props.episode.ID}>
            <div>
                Season:{props.episode.Season} Episode:{props.episode.Episode} {props.episode.Name}
            </div>
        </Link>
    );
};

export default withRouter(EpisodePage);
