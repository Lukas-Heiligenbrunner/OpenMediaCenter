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
import {DefaultTags} from "../../types/GeneralTypes";

interface props extends RouteComponentProps {}

interface state {
    sideinfo: VideoTypes.startDataType
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
                VideoNr: 0,
                FullHdNr: 0,
                HDNr: 0,
                SDNr: 0,
                DifferentTags: 0,
                Tagged: 0,
            },
            subtitle: 'All Videos',
            data: [],
            selectionnr: 0
        };
    }

    componentDidMount(): void {
        // initial get of all videos
        this.fetchVideoData(DefaultTags.all.TagId);
        this.fetchStartData();
    }

    /**
     * fetch available videos for specified tag
     * this function clears all preview elements an reloads gravity with tag
     *
     * @param tag tag to fetch videos
     */
    fetchVideoData(tag: number): void {
        callAPI(APINode.Video, {action: 'getMovies', tag: tag}, (result: VideoTypes.VideoUnloadedType[]) => {
            this.setState({
                data: []
            });
            this.setState({
                data: result,
                selectionnr: result.length,
            });
        });
    }

    /**
     * fetch the necessary data for left info box
     */
    fetchStartData(): void {
        callAPI(APINode.Video, {action: 'getStartData'}, (result: VideoTypes.startDataType) => {
            this.setState({sideinfo: result});
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
                            <SideBarItem><b>{this.state.sideinfo.VideoNr}</b> Videos Total!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.FullHdNr}</b> FULL-HD Videos!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.HDNr}</b> HD Videos!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.SDNr}</b> SD Videos!</SideBarItem>
                            <SideBarItem><b>{this.state.sideinfo.DifferentTags}</b> different Tags!</SideBarItem>
                            <Line/>
                            <SideBarTitle>Default Tags:</SideBarTitle>
                            <Tag tagInfo={{TagName: 'All', TagId: DefaultTags.all.TagId}} onclick={(): void => {
                                this.fetchVideoData(DefaultTags.all.TagId);
                                this.setState({subtitle: `All Videos`});
                            }}/>
                            <Tag tagInfo={{TagName: 'Full Hd', TagId: DefaultTags.fullhd.TagId}} onclick={(): void => {
                                this.fetchVideoData(DefaultTags.fullhd.TagId);
                                this.setState({subtitle: `Full Hd Videos`});
                            }}/>
                            <Tag tagInfo={{TagName: 'Low Quality', TagId: DefaultTags.lowq.TagId}}
                                 onclick={(): void => {
                                     this.fetchVideoData(DefaultTags.lowq.TagId);
                                     this.setState({subtitle: `Low Quality Videos`});
                                 }}/>
                            <Tag tagInfo={{TagName: 'HD', TagId: DefaultTags.hd.TagId}} onclick={(): void => {
                                this.fetchVideoData(DefaultTags.hd.TagId);
                                this.setState({subtitle: `HD Videos`});
                            }}/>
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
