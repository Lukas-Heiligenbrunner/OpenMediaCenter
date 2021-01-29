import React from 'react';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';

import style from './HomePage.module.css';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import {APINode, callAPI} from '../../utils/Api';
import {Route, Switch, withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import SearchHandling from './SearchHandling';
import {VideoTypes} from '../../types/ApiTypes';

interface props extends RouteComponentProps {}

interface state {
    sideinfo: {
        videonr: number,
        fullhdvideonr: number,
        hdvideonr: number,
        sdvideonr: number,
        tagnr: number
    },
    subtitle: string,
    data: VideoTypes.VideoUnloadedType[],
    selectionnr: number
}

/**
 * The home page component showing on the initial pageload
 */
export class HomePage extends React.Component<props, state> {
    /** keyword variable needed temporary store search keyword */
    keyword = '';

    constructor(props: props) {
        super(props);

        this.state = {
            sideinfo: {
                videonr: 0,
                fullhdvideonr: 0,
                hdvideonr: 0,
                sdvideonr: 0,
                tagnr: 0
            },
            subtitle: 'All Videos',
            data: [],
            selectionnr: 0
        };
    }

    componentDidMount(): void {
        // initial get of all videos
        this.fetchVideoData('All');
        this.fetchStartData();
    }

    /**
     * fetch available videos for specified tag
     * this function clears all preview elements an reloads gravity with tag
     *
     * @param tag tag to fetch videos
     */
    fetchVideoData(tag: string): void {
        callAPI(APINode.Video, {action: 'getMovies', tag: tag}, (result: VideoTypes.VideoUnloadedType[]) => {
            this.setState({
                data: []
            });
            this.setState({
                data: result,
                selectionnr: result.length,
                subtitle: `${tag} Videos`
            });
        });
    }

    /**
     * fetch the necessary data for left info box
     */
    fetchStartData(): void {
        callAPI(APINode.Video, {action: 'getStartData'}, (result: VideoTypes.startDataType) => {
            this.setState({
                sideinfo: {
                    videonr: result['total'],
                    fullhdvideonr: result['fullhd'],
                    hdvideonr: result['hd'],
                    sdvideonr: result['sd'],
                    tagnr: result['tags']
                }
            });
        });
    }


    render(): JSX.Element {
        return (
            <>
                <Switch>
                    <Route path='/search/:name'>
                        <SearchHandling/>
                    </Route>
                    <Route path='/'>
                        <PageTitle
                            title='Home Page'
                            subtitle={this.state.subtitle + ' - ' + this.state.selectionnr}>
                            <form className={'form-inline ' + style.searchform} onSubmit={(e): void => {
                                e.preventDefault();
                                this.props.history.push('/search/' + this.keyword);
                            }}>
                                <input data-testid='searchtextfield' className='form-control mr-sm-2'
                                       type='text' placeholder='Search'
                                       onChange={(e): void => {
                                           this.keyword = e.target.value;
                                       }}/>
                                <button data-testid='searchbtnsubmit' className='btn btn-success' type='submit'>Search</button>
                            </form>
                        </PageTitle>
                        <SideBar>
                            <SideBarTitle>Infos:</SideBarTitle>
                            <Line/>
                            <SideBarItem><b>{this.state.sideinfo.videonr}</b> Videos Total!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.fullhdvideonr}</b> FULL-HD Videos!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.hdvideonr}</b> HD Videos!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.sdvideonr}</b> SD Videos!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.tagnr}</b> different Tags!</SideBarItem>
                            <Line/>
                            <SideBarTitle>Default Tags:</SideBarTitle>
                            <Tag tagInfo={{tag_name: 'All', tag_id: -1}} onclick={(): void => this.fetchVideoData('All')}/>
                            <Tag tagInfo={{tag_name: 'FullHd', tag_id: -1}} onclick={(): void => this.fetchVideoData('FullHd')}/>
                            <Tag tagInfo={{tag_name: 'LowQuality', tag_id: -1}} onclick={(): void => this.fetchVideoData('LowQuality')}/>
                            <Tag tagInfo={{tag_name: 'HD', tag_id: -1}} onclick={(): void => this.fetchVideoData('HD')}/>
                        </SideBar>
                        {this.state.data.length !== 0 ?
                            <VideoContainer
                                data={this.state.data}/> :
                            <div>No Data found!</div>}
                        <div className={style.rightinfo}>

                        </div>
                    </Route>
                </Switch>
            </>
        );
    }
}

export default withRouter(HomePage);
