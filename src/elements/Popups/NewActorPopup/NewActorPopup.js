import React from 'react';
import PopupBase from '../PopupBase';
import style from './NewActorPopup.module.css';
import {callAPI} from '../../../utils/Api';

/**
 * creates modal overlay to define a new Tag
 */
class NewActorPopup extends React.Component {
    render() {
        return (
            <PopupBase title='Add new Tag' onHide={this.props.onHide} height='200px' width='400px'>
                <NewActorPopupContent onHide={this.props.onHide}/>
            </PopupBase>
        );
    }
}

export class NewActorPopupContent extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        return (
            <>
                <div>
                    <input type='text' placeholder='Actor Name' onChange={(v) => {
                        this.value = v.target.value;
                    }}/></div>
                <button className={style.savebtn} onClick={() => this.storeselection()}>Save</button>
            </>
        );
    }

    /**
     * store the filled in form to the backend
     */
    storeselection() {
        // check if user typed in name
        if (this.value === '' || this.value === undefined) return;

        callAPI('actor.php', {action: 'createActor', actorname: this.value}, (result) => {
            if (result.result !== 'success') {
                console.log('error occured while writing to db -- todo error handling');
                console.log(result.result);
            }
            this.props.onHide();
        });
    }
}

export default NewActorPopup;
