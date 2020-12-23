import React from "react";
import PopupBase from "../PopupBase";
import style from "../NewActorPopup/NewActorPopup.module.css";
import {setCustomBackendDomain} from "../../../utils/Api";

interface NBCProps {
    onHide: (_: void) => void
}

export function NoBackendConnectionPopup(props: NBCProps): JSX.Element {
    return (
        <PopupBase title='No connection to backend API!' onHide={props.onHide} height='200px' width='600px'>
            <div>
                <input type='text' placeholder='http://192.168.0.2' onChange={(v):void => {
                    setCustomBackendDomain(v.target.value);
                }}/></div>
            <button className={style.savebtn} onClick={():void => props.onHide()}>Refresh</button>
        </PopupBase>
    );
}
