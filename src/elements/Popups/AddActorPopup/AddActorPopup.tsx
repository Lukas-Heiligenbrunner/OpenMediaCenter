import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';
import style from './AddActorPopup.module.css';
import {NewActorPopupContent} from '../NewActorPopup/NewActorPopup';
import {APINode, callAPI} from '../../../utils/Api';
import {ActorType} from '../../../types/VideoTypes';
import {GeneralSuccess} from '../../../types/GeneralTypes';
import FilterButton from '../../FilterButton/FilterButton';

interface props {
    onHide: () => void;
    movie_id: number;
}

interface state {
    contentDefault: boolean;
    actors: ActorType[];
    filter: string;
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
            filter: ''
        };

        this.tileClickHandler = this.tileClickHandler.bind(this);
        this.filterSearch = this.filterSearch.bind(this);
        this.parentSubmit = this.parentSubmit.bind(this);
    }
    componentDidMount(): void {
        // fetch the available actors
        this.loadActors();
    }

    render(): JSX.Element {
        return (
            <>
                {/* todo render actor tiles here and add search field*/}
                <PopupBase
                    title='Add new Actor to Video'
                    onHide={this.props.onHide}
                    banner={
                        <button
                            className={style.newactorbutton}
                            onClick={(): void => {
                                this.setState({contentDefault: false});
                            }}>
                            Create new Actor
                        </button>
                    }
                    ParentSubmit={this.parentSubmit}>
                    {this.resolvePage()}
                </PopupBase>
            </>
        );
    }

    /**
     * selector for current showing popup page
     * @returns {JSX.Element}
     */
    resolvePage(): JSX.Element {
        if (this.state.contentDefault) {
            return this.getContent();
        } else {
            return (
                <NewActorPopupContent
                    onHide={(): void => {
                        this.loadActors();
                        this.setState({contentDefault: true});
                    }}
                />
            );
        }
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
                        <FilterButton
                            onFilterChange={(filter): void => {
                                this.setState({filter: filter});
                            }}
                        />
                    </div>
                    {this.state.actors.filter(this.filterSearch).map((el) => (
                        <ActorTile actor={el} onClick={this.tileClickHandler} />
                    ))}
                </>
            );
        } else {
            return <div>somekind of loading</div>;
        }
    }

    /**
     * event handling for ActorTile Click
     */
    tileClickHandler(actor: ActorType): void {
        // fetch the available actors
        callAPI<GeneralSuccess>(
            APINode.Actor,
            {
                action: 'addActorToVideo',
                ActorId: actor.ActorId,
                MovieId: this.props.movie_id
            },
            (result) => {
                if (result.result === 'success') {
                    // return back to player page
                    this.props.onHide();
                } else {
                    console.error('an error occured while fetching actors: ' + result);
                }
            }
        );
    }

    /**
     * load the actors from backend and set state
     */
    loadActors(): void {
        callAPI<ActorType[]>(APINode.Actor, {action: 'getAllActors'}, (result) => {
            this.setState({actors: result});
        });
    }

    /**
     * filter the actor array for search matches
     * @param actor
     */
    private filterSearch(actor: ActorType): boolean {
        return actor.Name.toLowerCase().includes(this.state.filter.toLowerCase());
    }

    /**
     * handle a Popupbase parent submit action
     */
    private parentSubmit(): void {
        // allow submit only if one item is left in selection
        const filteredList = this.state.actors.filter(this.filterSearch);

        if (filteredList.length === 1) {
            // simulate click if parent submit
            this.tileClickHandler(filteredList[0]);
        }
    }
}

export default AddActorPopup;
