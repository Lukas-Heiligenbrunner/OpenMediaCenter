import React from 'react';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import style from './ActorPage.module.css';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';

class ActorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {data: []};
    }

    render() {
        return (
            <>
                <PageTitle title={this.props.actor.name} subtitle='5 videos'/>
                <SideBar>
                    <div className={style.pic}>
                        <FontAwesomeIcon style={{color: 'white'}} icon={faUser} size='10x'/>
                    </div>
                    <SideBarTitle>Infos:</SideBarTitle>
                    <Line/>
                    <SideBarItem><b>35</b> Videos Total!</SideBarItem>
                </SideBar>
                {this.state.data.length !== 0 ?
                    <VideoContainer
                        data={this.state.data}/> :
                    <div>No Data found!</div>}
            </>
        );
    }

    componentDidMount() {
        this.getActorInfo();
    }

    /**
     * request more actor info from backend
     */
    getActorInfo() {
        // todo 2020-12-4: fetch to db
    }
}

export default ActorPage;
