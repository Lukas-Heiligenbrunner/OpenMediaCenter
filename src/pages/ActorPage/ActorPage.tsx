import React from 'react';
import PageTitle from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import style from './ActorPage.module.css';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {callAPI} from '../../utils/Api';
import {ActorType, VideoUnloadedType} from '../../api/VideoTypes';
import {Link, withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {Button} from '../../elements/GPElements/Button';

interface state {
    data: VideoUnloadedType[],
    actor: ActorType
}

/**
 * empty default props with id in url
 */
interface props extends RouteComponentProps<{ id: string }> {
}

/**
 * result of actor fetch
 */
interface videofetchresult {
    videos: VideoUnloadedType[];
    info: ActorType;
}

/**
 * info page about a specific actor and a list of all its videos
 */
export class ActorPage extends React.Component<props, state> {
    constructor(props: props) {
        super(props);

        this.state = {data: [], actor: {actor_id: 0, name: '', thumbnail: ''}};
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle title={this.state.actor.name} subtitle={this.state.data ? this.state.data.length + ' videos' : ''}>
                    <span className={style.overviewbutton}>
                        <Link to='/actors'>
                            <Button onClick={(): void => {}} title='Go to Actor overview'/>
                        </Link>
                    </span>
                </PageTitle>
                <SideBar>
                    <div className={style.pic}>
                        <FontAwesomeIcon style={{color: 'white'}} icon={faUser} size='10x'/>
                    </div>
                    <SideBarTitle>Attention: This is an early preview!</SideBarTitle>
                </SideBar>
                {this.state.data.length !== 0 ?
                    <VideoContainer
                        data={this.state.data}/> :
                    <div>No Data found!</div>}
            </>
        );
    }

    componentDidMount(): void {
        this.getActorInfo();
    }

    /**
     * request more actor info from backend
     */
    getActorInfo(): void {
        callAPI('actor.php', {
            action: 'getActorInfo',
            actorid: this.props.match.params.id
        }, (result: videofetchresult) => {
            this.setState({
                data: result.videos ? result.videos : [],
                actor: result.info
            });
        });
    }
}

export default withRouter(ActorPage);
