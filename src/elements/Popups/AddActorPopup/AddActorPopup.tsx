import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';
import style from './AddActorPopup.module.css';
import {NewActorPopupContent} from '../NewActorPopup/NewActorPopup';
import {callAPI} from '../../../utils/Api';
import {ActorType} from '../../../types/VideoTypes';
import {GeneralSuccess} from '../../../types/GeneralTypes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFilter, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Button} from '../../GPElements/Button';

interface props {
    onHide: () => void;
    movie_id: number;
}

interface state {
    contentDefault: boolean;
    actors: ActorType[];
    filter: string;
    filtervisible: boolean;
}

/**
 * Popup for Adding a new Actor to a Video
 */
class AddActorPopup extends React.Component<props, state> {
    // filterfield anchor, needed to focus after filter btn click
    private filterfield: HTMLInputElement | null | undefined;

    constructor(props: props) {
        super(props);

        this.state = {
            contentDefault: true,
            actors: [],
            filter: '',
            filtervisible: false
        };

        this.tileClickHandler = this.tileClickHandler.bind(this);
        this.filterSearch = this.filterSearch.bind(this);
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
            return (
                <>
                    <div className={style.searchbar}>
                        {
                            this.state.filtervisible ?
                                <>
                                    <input className={'form-control mr-sm-2 ' + style.searchinput}
                                           type='text' placeholder='Filter' value={this.state.filter}
                                           onChange={(e): void => {
                                               this.setState({filter: e.target.value});
                                           }}
                                    ref={(input): void => {this.filterfield = input;}}/>
                                    <Button title={<FontAwesomeIcon style={{
                                        verticalAlign: 'middle',
                                        lineHeight: '130px'
                                    }} icon={faTimes} size='1x'/>} color={{backgroundColor: 'red'}} onClick={(): void => {
                                        this.setState({filter: '', filtervisible: false});
                                    }}/>
                                </> :
                                <Button title={<span>Filter <FontAwesomeIcon style={{
                                    verticalAlign: 'middle',
                                    lineHeight: '130px'
                                }} icon={faFilter} size='1x'/></span>} color={{backgroundColor: 'cornflowerblue', color: 'white'}} onClick={(): void => {
                                    this.setState({filtervisible: true}, () => {
                                        // focus filterfield after state update
                                        this.filterfield?.focus();
                                    });
                                }}/>
                        }
                    </div>
                    {this.state.actors.filter(this.filterSearch).map((el) => (<ActorTile actor={el} onClick={this.tileClickHandler}/>))}
                </>
            );
        } else {
            return (<div>somekind of loading</div>);
        }
    }

    /**
     * filter the actor array for search matches
     * @param actor
     */
    private filterSearch(actor: ActorType): boolean {
        return actor.name.toLowerCase().includes(this.state.filter.toLowerCase());
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
                console.error('an error occured while fetching actors: ' + result);
            }
        });
    }

    /**
     * load the actors from backend and set state
     */
    loadActors(): void {
        callAPI<ActorType[]>('actor.php', {action: 'getAllActors'}, result => {
            this.setState({actors: result});
        });
    }
}

export default AddActorPopup;
