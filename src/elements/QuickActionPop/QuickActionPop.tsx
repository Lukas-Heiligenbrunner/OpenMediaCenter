import React from 'react';
import style from './QuickActionPopup.module.css'

interface props{

}

class QuickActionPop extends React.Component<props> {
    constructor(props: props) {
        super(props);

        this.state = {};
    }

    render(): JSX.Element {
        return (
            <div className={style.quickaction}>
                <div onClick={():void => {console.log('clicked');}}>testi</div>testi
            </div>
        );
    }
}

export default QuickActionPop;
