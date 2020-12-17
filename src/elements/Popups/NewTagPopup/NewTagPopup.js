import React from 'react';
import PopupBase from '../PopupBase';
import style from './NewTagPopup.module.css';
import {callAPI} from '../../../utils/Api';

/**
 * creates modal overlay to define a new Tag
 */
class NewTagPopup extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.props = props;
    }

    render() {
        return (
            <PopupBase title='Add new Tag' onHide={this.props.onHide} height='200px' width='400px'>
                <div><input type='text' placeholder='Tagname' onChange={(v) => {
                    this.value = v.target.value;
                }}/></div>
                <button className={style.savebtn} onClick={() => this.storeselection()}>Save</button>
            </PopupBase>
        );
    }

    /**
     * store the filled in form to the backend
     */
    storeselection() {
        callAPI('tags.php', {action: 'createTag', tagname: this.value}, result => {
            if (result.result !== 'success') {
                console.log('error occured while writing to db -- todo error handling');
                console.log(result.result);
            }
            this.props.onHide();
        });
    }
}

export default NewTagPopup;
