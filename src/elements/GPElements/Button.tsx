import React from 'react';
import style from './Button.module.css';

interface ButtonProps {
    title: string;
    onClick?: () => void;
    color?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element {
    return (
        <button className={style.button} style={props.color} onClick={props.onClick}>
            {props.title}
        </button>
    );
}
