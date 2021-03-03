import React from 'react';
import PopupBase from '../PopupBase';
import style from './NewTagPopup.module.css';
import {APINode, callAPI} from '../../../utils/Api';
import {GeneralSuccess} from '../../../types/GeneralTypes';

interface props {
    onHide: () => void
}

/**
 * creates modal overlay to define a new Tag
 */
class NewTagPopup extends React.Component<props> {
    private value: string = '';

    render(): JSX.Element {
        return (
            <PopupBase title='Add new Tag' onHide={this.props.onHide} height='200px' width='400px' ParentSubmit={(): void => this.storeselection()}>
                <div><input type='text' placeholder='Tagname' onChange={(v): void => {
                    this.value = v.target.value;
                }}/></div>
                <button className={style.savebtn} onClick={(): void => this.storeselection()}>Save</button>
            </PopupBase>
        );
    }

    /**
     * store the filled in form to the backend
     */
    storeselection(): void {
        callAPI(APINode.Tags, {action: 'createTag', TagName: this.value}, (result: GeneralSuccess) => {
            if (result.result !== 'success') {
                console.log('error occured while writing to db -- todo error handling');
                console.log(result.result);
            }
            this.props.onHide();
        });
    }
}

export default NewTagPopup;
