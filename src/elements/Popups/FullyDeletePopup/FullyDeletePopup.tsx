import React from 'react';
import PopupBase from '../PopupBase';
import {Button} from '../../GPElements/Button';

/**
 * Delete Video popup
 * can only be rendered once!
 * @constructor
 */
export const FullyDeletePopup = (props: {onSubmit: () => void; onDeny: () => void; onDiscard: () => void}): JSX.Element => {
    return (
        <>
            <PopupBase
                title='Fully Delete Video?'
                onHide={(): void => props.onDiscard()}
                height='200px'
                width='350px'
                ParentSubmit={(): void => {
                    props.onSubmit();
                }}>
                <Button
                    onClick={(): void => {
                        props.onSubmit();
                    }}
                    title='Fully Delete!'
                />
                <Button
                    color={{backgroundColor: 'red'}}
                    onClick={(): void => {
                        props.onDeny();
                    }}
                    title='Only DB Entries'
                />
            </PopupBase>
        </>
    );
};
