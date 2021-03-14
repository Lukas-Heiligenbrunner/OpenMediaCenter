import React from 'react';
import {APINode, callAPI} from '../../utils/Api';
import {ActorType} from '../../types/VideoTypes';
import ActorTile from '../../elements/ActorTile/ActorTile';
import PageTitle from '../../elements/PageTitle/PageTitle';
import SideBar from '../../elements/SideBar/SideBar';
import style from './ActorOverviewPage.module.css';
import {Button} from '../../elements/GPElements/Button';
import NewActorPopup from '../../elements/Popups/NewActorPopup/NewActorPopup';

interface props {}

interface state {
    actors: ActorType[];
    NActorPopupVisible: boolean;
}

class ActorOverviewPage extends React.Component<props, state> {
    constructor(props: props) {
        super(props);

        this.state = {
            actors: [],
            NActorPopupVisible: false
        };
    }

    componentDidMount(): void {
        this.fetchAvailableActors();
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle title='Actors' subtitle={this.state.actors.length + ' Actors'} />
                <SideBar>
                    <Button title='Add Actor' onClick={(): void => this.setState({NActorPopupVisible: true})} />
                </SideBar>
                <div className={style.container}>
                    {this.state.actors.map((el) => (
                        <ActorTile key={el.ActorId} actor={el} />
                    ))}
                </div>
                {this.state.NActorPopupVisible ? (
                    <NewActorPopup
                        onHide={(): void => {
                            this.setState({NActorPopupVisible: false});
                            this.fetchAvailableActors(); // refetch actors
                        }}
                    />
                ) : null}
            </>
        );
    }

    fetchAvailableActors(): void {
        callAPI<ActorType[]>(APINode.Actor, {action: 'getAllActors'}, (result) => {
            this.setState({actors: result});
        });
    }
}

export default ActorOverviewPage;
