import React from 'react';
import PageTitle from '../../elements/PageTitle/PageTitle';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';
import style from './ActorPage.module.css';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {APINode, callAPI} from '../../utils/Api';
import {ActorType} from '../../types/VideoTypes';
import {Link, withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import {Button} from '../../elements/GPElements/Button';
import {ActorTypes, VideoTypes} from '../../types/ApiTypes';

interface state {
    data: VideoTypes.VideoUnloadedType[];
    actor: ActorType;
}

/**
 * empty default props with id in url
 */
interface Props extends RouteComponentProps<{id: string}> {}

/**
 * info page about a specific actor and a list of all its videos
 */
export class ActorPage extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {data: [], actor: {ActorId: 0, Name: '', Thumbnail: ''}};
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle title={this.state.actor.Name} subtitle={this.state.data ? this.state.data.length + ' videos' : null}>
                    <span className={style.overviewbutton}>
                        <Link to='/actors'>
                            <Button onClick={(): void => {}} title='Go to Actor overview' />
                        </Link>
                    </span>
                </PageTitle>
                <SideBar>
                    <div className={style.pic}>
                        <FontAwesomeIcon style={{color: 'white'}} icon={faUser} size='10x' />
                    </div>
                    <SideBarTitle>Attention: This is an early preview!</SideBarTitle>
                </SideBar>
                {this.state.data.length !== 0 ? <VideoContainer data={this.state.data} /> : <div>No Data found!</div>}
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
        callAPI(
            APINode.Actor,
            {
                action: 'getActorInfo',
                ActorId: parseInt(this.props.match.params.id, 10)
            },
            (result: ActorTypes.videofetchresult) => {
                this.setState({
                    data: result.Videos ? result.Videos : [],
                    actor: result.Info
                });
            }
        );
    }
}

export default withRouter(ActorPage);
