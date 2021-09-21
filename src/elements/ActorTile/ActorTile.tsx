import style from './ActorTile.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import {Link} from 'react-router-dom';
import {ActorType} from '../../types/VideoTypes';

interface Props {
    actor: ActorType;
    onClick?: (actor: ActorType) => void;
}

class ActorTile extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    render(): JSX.Element {
        if (this.props.onClick) {
            return this.renderActorTile(this.props.onClick);
        } else {
            return <Link to={{pathname: '/media/actors/' + this.props.actor.ActorId}}>{this.renderActorTile(() => {})}</Link>;
        }
    }

    renderActorTile(customclickhandler: (actor: ActorType) => void): JSX.Element {
        return (
            <div className={style.actortile} onClick={(): void => customclickhandler(this.props.actor)}>
                <div className={style.actortile_thumbnail}>
                    {
                        this.props.actor.Thumbnail === '' ? (
                            <FontAwesomeIcon
                                style={{
                                    lineHeight: '130px'
                                }}
                                icon={faUser}
                                size='5x'
                            />
                        ) : (
                            'dfdf'
                        ) /* todo render picture provided here! */
                    }
                </div>
                <div className={style.actortile_name}>{this.props.actor.Name}</div>
            </div>
        );
    }
}

export default ActorTile;
