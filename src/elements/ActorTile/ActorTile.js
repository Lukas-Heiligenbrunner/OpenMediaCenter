import style from './ActorTile.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import GlobalInfos from '../../utils/GlobalInfos';
import ActorPage from '../../pages/ActorPage/ActorPage';

class ActorTile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={style.actortile} onClick={() => this.handleActorClick(this.props.actor)}>
                <div className={style.actortile_thumbnail}>
                    {this.props.actor.thumbnail === null ? <FontAwesomeIcon style={{
                        lineHeight: '130px'
                    }} icon={faUser} size='5x'/> : 'dfdf' /* todo render picture provided here! */}
                </div>
                <div className={style.actortile_name}>{this.props.actor.name}</div>
            </div>
        );
    }

    /**
     * event handling for actor tile click
     */
    handleActorClick(actor) {
        // if clicklistender is defined use this one
        if (this.props.onClick) {
            this.props.onClick(actor.id);
            return;
        }

        // Redirect to actor page
        GlobalInfos.getViewBinding().changeRootElement(<ActorPage actor={actor}/>);
    }
}

export default ActorTile;
