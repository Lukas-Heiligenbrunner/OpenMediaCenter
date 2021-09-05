import React from 'react';
import PopupBase from '../PopupBase';
import {Button} from '../../GPElements/Button';

/**
 * Delete Video popup
 * can only be rendered once!
 * @constructor
 */
export const ButtonPopup = (props: {
    onSubmit: () => void;
    onDeny: () => void;
    onAlternativeButton?: () => void;
    SubmitButtonTitle: string;
    DenyButtonTitle: string;
    AlternativeButtonTitle?: string;
    Title: string;
}): JSX.Element => {
    return (
        <>
            <PopupBase
                title={props.Title}
                onHide={(): void => props.onDeny()}
                height='200px'
                width='400px'
                ParentSubmit={(): void => {
                    props.onSubmit();
                }}>
                <Button
                    onClick={(): void => {
                        props.onSubmit();
                    }}
                    title={props.SubmitButtonTitle}
                />

                {props.AlternativeButtonTitle ? (
                    <Button
                        color={{backgroundColor: 'darkorange'}}
                        onClick={(): void => {
                            props.onAlternativeButton ? props.onAlternativeButton() : null;
                        }}
                        title={props.AlternativeButtonTitle}
                    />
                ) : (
                    <></>
                )}

                <Button
                    color={{backgroundColor: 'red'}}
                    onClick={(): void => {
                        props.onDeny();
                    }}
                    title={props.DenyButtonTitle}
                />
            </PopupBase>
        </>
    );
};
