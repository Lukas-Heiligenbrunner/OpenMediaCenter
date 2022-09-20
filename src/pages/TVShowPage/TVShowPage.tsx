import React from 'react';
import Preview from '../../elements/Preview/Preview';
import {APINode, callAPI, callAPIPlain} from '../../utils/Api';
import {TVShow} from '../../types/ApiTypes';
import DynamicContentContainer from '../../elements/DynamicContentContainer/DynamicContentContainer';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import EpisodePage from './EpisodePage';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';

interface State {
    loading: boolean;
}

interface Props {}

export class TVShowPage extends React.Component<Props, State> {
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
            <>
                <PageTitle title='TV Shows' subtitle='' />
                <SideBar>
                    <SideBarTitle>Infos:</SideBarTitle>
                    <Line />
                    <SideBarItem>
                        <b>{this.data.length}</b> TV-Shows Total!
                    </SideBarItem>
                </SideBar>
                <div>
                    <DynamicContentContainer
                        renderElement={(elem): JSX.Element => (
                            <Preview
                                key={elem.Id}
                                name={elem.Name}
                                picLoader={(callback: (pic: string) => void): void => {
                                    callAPIPlain(
                                        APINode.TVShow,
                                        {
                                            action: 'readThumbnail',
                                            Id: elem.Id
                                        },
                                        (result) => callback(result)
                                    );
                                }}
                                linkPath={'/media/tvshows/' + elem.Id}
                            />
                        )}
                        data={this.state.loading ? [] : this.data}
                        initialLoadNr={20}
                    />
                </div>
            </>
        );
    }
}

export default function (): JSX.Element {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={`${match.path}/:id`}>
                <EpisodePage />
            </Route>
            <Route path={match.path}>
                <TVShowPage />
            </Route>
        </Switch>
    );
}
