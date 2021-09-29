import React from 'react';
import style from './Button.module.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import GlobalInfos from '../../utils/GlobalInfos';

interface ButtonProps {
    title: string | JSX.Element;
    onClick?: () => void;
    color?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element {
    const theme = GlobalInfos.getThemeStyle();

    return (
        <button className={style.button + ' ' + theme.textcolor} style={props.color} onClick={props.onClick}>
            {props.title}
        </button>
    );
}

interface IconButtonProps {
    title: string | JSX.Element;
    onClick?: () => void;
    icon: IconDefinition;
}

export function IconButton(props: IconButtonProps): JSX.Element {
    const theme = GlobalInfos.getThemeStyle();

    return (
        <button className={style.button + ' ' + theme.textcolor} style={{backgroundColor: '#00000000'}} onClick={props.onClick}>
            <span style={{fontSize: 12}}>
                <FontAwesomeIcon className={theme.textcolor} icon={props.icon} size='2x' />
            </span>
            <span style={{marginLeft: 10}}>{props.title}</span>
        </button>
    );
}
