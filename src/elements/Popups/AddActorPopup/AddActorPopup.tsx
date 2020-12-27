import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';
import style from './AddActorPopup.module.css';
import {NewActorPopupContent} from '../NewActorPopup/NewActorPopup';
import {callAPI} from '../../../utils/Api';
import {ActorType} from '../../../api/VideoTypes';
import {GeneralSuccess} from '../../../api/GeneralTypes';

interface props {
    onHide: () => void;
    movie_id: number;
}

interface state {
    contentDefault: boolean;
    actors: ActorType[];
}

/**
 * Popup for Adding a new Actor to a Video
 */
class AddActorPopup extends React.Component<props, state> {
    constructor(props: props) {
        super(props);

        this.state = {
            contentDefault: true,
            actors: []
        };

        this.tileClickHandler = this.tileClickHandler.bind(this);
    }

    render(): JSX.Element {
        return (
            <>
                {/* todo render actor tiles here and add search field*/}
                <PopupBase title='Add new Actor to Video' onHide={this.props.onHide} banner={
                    <button
                        className={style.newactorbutton}
                        onClick={(): void => {
                            this.setState({contentDefault: false});
                        }}>Create new Actor</button>}>
                    {this.resolvePage()}
                </PopupBase>
            </>
        );
    }

    componentDidMount(): void {
        // fetch the available actors
        this.loadActors();
    }

    /**
     * selector for current showing popup page
     * @returns {JSX.Element}
     */
    resolvePage(): JSX.Element {
        if (this.state.contentDefault) return (this.getContent());
        else return (<NewActorPopupContent onHide={(): void => {
            this.loadActors();
            this.setState({contentDefault: true});
        }}/>);
    }

    /**
     * returns content for the newActor popup
     * @returns {JSX.Element}
     */
    getContent(): JSX.Element {
        if (this.state.actors.length !== 0) {
            return (<div>
                {this.state.actors.map((el) => (<ActorTile actor={el} onClick={this.tileClickHandler}/>))}
            </div>);
        } else {
            return (<div>somekind of loading</div>);
        }
    }

    /**
     * event handling for ActorTile Click
     */
    tileClickHandler(actor: ActorType): void {
        // fetch the available actors
        callAPI<GeneralSuccess>('actor.php', {
            action: 'addActorToVideo',
            actorid: actor.actor_id,
            videoid: this.props.movie_id
        }, result => {
            if (result.result === 'success') {
                // return back to player page
                this.props.onHide();
            } else {
                console.error('an error occured while fetching actors');
                console.error(result);
            }
        });
    }

    loadActors(): void {
        callAPI<ActorType[]>('actor.php', {action: 'getAllActors'}, result => {
            this.setState({actors: result});
        });
    }
}

export default AddActorPopup;
