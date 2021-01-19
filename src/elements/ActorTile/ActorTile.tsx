import style from './ActorTile.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {Link} from 'react-router-dom';
import {ActorType} from '../../types/VideoTypes';

interface props {
    actor: ActorType;
    onClick?: (actor: ActorType) => void
}

class ActorTile extends React.Component<props> {
    constructor(props: props) {
        super(props);

        this.state = {};
    }

    render(): JSX.Element {
        if (this.props.onClick) {
            return this.renderActorTile(this.props.onClick);
        } else {
            return (
                <Link to={{pathname: '/actors/' + this.props.actor.actor_id}}>
                    {this.renderActorTile(() => {
                    })}
                </Link>
            );
        }

    }

    renderActorTile(customclickhandler: (actor: ActorType) => void): JSX.Element {
        console.log(this.props.actor);
        return (
            <div className={style.actortile} onClick={(): void => customclickhandler(this.props.actor)}>
                <div className={style.actortile_thumbnail}>
                    {this.props.actor.thumbnail === null ? <FontAwesomeIcon style={{
                        lineHeight: '130px'
                    }} icon={faUser} size='5x'/> : 'dfdf' /* todo render picture provided here! */}
                </div>
                <div className={style.actortile_name}>{this.props.actor.name}</div>
            </div>
        );
    }
}

export default ActorTile;
