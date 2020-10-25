import React from 'react';
import style from './InfoHeaderItem.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Spinner} from 'react-bootstrap';

/**
 * a component to display one of the short quickinfo tiles on dashboard
 */
class InfoHeaderItem extends React.Component {
    render() {
        return (
            <div onClick={() => {
                // call clicklistener if defined
                if (this.props.onClick != null) this.props.onClick();
            }} className={style.infoheaderitem} style={{backgroundColor: this.props.backColor}}>
                <div className={style.icon}>
                    <FontAwesomeIcon style={{
                        verticalAlign: 'middle',
                        lineHeight: '130px'
                    }} icon={this.props.icon} size='5x'/>
                </div>
                {this.props.text !== null && this.props.text !== undefined ?
                    <>
                        <div className={style.maintext}>{this.props.text}</div>
                        <div className={style.subtext}>{this.props.subtext}</div>
                    </>
                    : <span className={style.loadAnimation}><Spinner animation='border'/></span>
                }
            </div>
        );
    }
}

export default InfoHeaderItem;
