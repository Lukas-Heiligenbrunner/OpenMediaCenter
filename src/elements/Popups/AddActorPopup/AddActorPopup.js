import PopupBase from '../PopupBase';
import React from 'react';
import ActorTile from '../../ActorTile/ActorTile';

class AddActorPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

    }

    render() {
        return (
            // todo render actor tiles here and add search field
            <PopupBase title='Add new Actor to Video' onHide={this.props.onHide}>
                <ActorTile actor={{id: 0, name: 'henry', thumbnail: '-1'}}/>
            </PopupBase>
        );
    }
}

export default AddActorPopup;
