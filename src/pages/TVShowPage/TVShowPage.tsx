import React from 'react';
import Preview from '../../elements/Preview/Preview';
import {APINode, callAPI} from '../../utils/Api';
import {TVShow} from '../../types/ApiTypes';
import DynamicContentContainer from '../../elements/DynamicContentContainer/DynamicContentContainer';
import {Route, Switch, useRouteMatch} from 'react-router-dom';

interface State {
    loading: boolean;
}

interface Props {}

class TVShowPage extends React.Component<Props, State> {
    state = {
        loading: true
    };

    data: TVShow.TVshowType[] = [];

    componentDidMount(): void {
        callAPI(APINode.TVShow, {action: 'getTVShows'}, (resp: TVShow.TVshowType[]) => {
            this.data = resp;
            this.setState({loading: false});
        });
    }

    render(): JSX.Element {
        return (
            <DynamicContentContainer
                renderElement={(elem): JSX.Element => (
                    <Preview name={elem.Name} picLoader={(callback): void => callback('')} linkPath={'/tvshows/' + elem.Id} />
                )}
                data={this.state.loading ? [] : this.data}
            />
        );
    }
}

export default function (): JSX.Element {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/:episodeID`}>
                <div>hey from episode page</div>
            </Route>
            <Route path={match.path}>
                <TVShowPage />
            </Route>
        </Switch>
    );
}
