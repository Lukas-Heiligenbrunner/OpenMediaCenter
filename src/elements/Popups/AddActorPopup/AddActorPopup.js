import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';
import style from './AddActorPopup.module.css';
import NewTagPopup from '../NewTagPopup/NewTagPopup';

class AddActorPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            createActorPopup: false
        };

    }

    render() {
        return (
            <>
                {/* todo render actor tiles here and add search field*/}
                <PopupBase title='Add new Actor to Video' onHide={this.props.onHide} banner={
                    <button
                        className={style.newactorbutton}
                        onClick={() => {this.setState({createActorPopup: true});}}>Create new Actor</button>}>
                    <ActorTile actor={{id: 0, name: 'henry', thumbnail: '-1'}}/>
                </PopupBase>
                {this.handlePopovers()}
            </>
        );
    }

    handlePopovers() {
        // todo two popups on same time not possible
        return (this.state.createActorPopup ? <NewTagPopup></NewTagPopup> : null);
    }
}

export default AddActorPopup;
