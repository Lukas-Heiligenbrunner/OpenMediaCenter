import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';
import style from './AddActorPopup.module.css';
import {NewActorPopupContent} from '../NewActorPopup/NewActorPopup';

/**
 * Popup for Adding a new Actor to a Video
 */
class AddActorPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentDefault: true
        };
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

    /**
     * selector for current showing popup page
     * @returns {JSX.Element}
     */
    resolvePage() {
        if (this.state.contentDefault) return(this.getContent());
        else return (<NewActorPopupContent onHide={() => {this.setState({contentDefault: true});}}/>);
    }

    /**
     * returns content for the newActor popup
     * @returns {JSX.Element}
     */
    getContent() {
        return (<ActorTile actor={{id: 0, name: 'henry', thumbnail: '-1'}}/>);
    }
}

export default AddActorPopup;
