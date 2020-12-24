import React from 'react';
import PopupBase from '../PopupBase';
import style from './NewActorPopup.module.css';
import {callAPI} from '../../../utils/Api';
import {GeneralSuccess} from '../../../api/GeneralTypes';

interface NewActorPopupProps{
    onHide: () => void;
}

/**
 * creates modal overlay to define a new Tag
 */
class NewActorPopup extends React.Component<NewActorPopupProps> {
    render(): JSX.Element {
        return (
            <PopupBase title='Add new Tag' onHide={this.props.onHide} height='200px' width='400px'>
                <NewActorPopupContent onHide={this.props.onHide}/>
            </PopupBase>
        );
    }
}

export class NewActorPopupContent extends React.Component<NewActorPopupProps> {
    value: string | undefined;

    render(): JSX.Element {
        return (
            <>
                <div>
                    <input type='text' placeholder='Actor Name' onChange={(v):void => {
                        this.value = v.target.value;
                    }}/></div>
                <button className={style.savebtn} onClick={():void => this.storeselection()}>Save</button>
            </>
        );
    }

    /**
     * store the filled in form to the backend
     */
    storeselection(): void {
        // check if user typed in name
        if (this.value === '' || this.value === undefined) return;

        callAPI('actor.php', {action: 'createActor', actorname: this.value}, (result: GeneralSuccess) => {
            if (result.result !== 'success') {
                console.log('error occured while writing to db -- todo error handling');
                console.log(result.result);
            }
            this.props.onHide();
        });
    }
}

export default NewActorPopup;
