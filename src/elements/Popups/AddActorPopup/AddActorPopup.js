import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';
import style from './AddActorPopup.module.css';
import {NewActorPopupContent} from '../NewActorPopup/NewActorPopup';
import {callAPI} from '../../../utils/Api';

/**
 * Popup for Adding a new Actor to a Video
 */
class AddActorPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentDefault: true,
            actors: undefined
        };

        this.tileClickHandler = this.tileClickHandler.bind(this);
    }

    render() {
        return (
            <>
                {/* todo render actor tiles here and add search field*/}
                <PopupBase title='Add new Actor to Video' onHide={this.props.onHide} banner={
                    <button
                        className={style.newactorbutton}
                        onClick={() => {this.setState({contentDefault: false});}}>Create new Actor</button>}>
                    {this.resolvePage()}
                </PopupBase>
            </>
        );
    }

    componentDidMount() {
        // fetch the available actors
        this.loadActors();
    }

    /**
     * selector for current showing popup page
     * @returns {JSX.Element}
     */
    resolvePage() {
        if (this.state.contentDefault) return (this.getContent());
        else return (<NewActorPopupContent onHide={() => {
            this.loadActors();
            this.setState({contentDefault: true});
        }}/>);
    }

    /**
     * returns content for the newActor popup
     * @returns {JSX.Element}
     */
    getContent() {
        if (this.state.actors) {
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
    tileClickHandler(actorid) {
        // fetch the available actors
        callAPI('actor.php', {action: 'addActorToVideo', actorid: actorid, videoid: this.props.movie_id}, result => {
            if (result.result === 'success') {
                // return back to player page
                this.props.onHide();
            } else {
                console.error('an error occured while fetching actors');
                console.error(result);
            }
        });
    }

    loadActors() {
        callAPI('actor.php', {action: 'getAllActors'}, result => {
            this.setState({actors: result});
        });
    }
}

export default AddActorPopup;