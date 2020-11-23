import style from './ActorTile.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

class ActorTile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={style.actortile} onClick={() => this.handleActorClick(this.props.actor.id)}>
                <div className={style.actortile_thumbnail}>
                    {this.props.actor.thumbnail === '-1' ? <FontAwesomeIcon style={{
                        lineHeight: '130px'
                    }} icon={faUser} size='5x'/> : 'dfdf' /* todo render picture provided here! */}
                </div>
                <div className={style.actortile_name}>{this.props.actor.name}</div>
            </div>
        );
    }
}

export default ActorTile;
