import React from 'react';
import PopupBase from '../PopupBase';
import {Button} from '../../GPElements/Button';

interface Props {
    onHide: (_: void) => void;
    submit: (_: void) => void;
}

export default function SubmitPopup(props: Props): JSX.Element {
    return (
        <PopupBase title='Are you sure?' onHide={props.onHide} height='160px' width='300px'>
            <Button title='Submit' color={{backgroundColor: 'green'}} onClick={(): void => props.submit()} />
            <Button title='Cancel' color={{backgroundColor: 'red'}} onClick={(): void => props.onHide()} />
        </PopupBase>
    );
}
