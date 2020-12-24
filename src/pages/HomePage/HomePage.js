import React from 'react';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';

import style from './HomePage.module.css';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import {callAPI} from '../../utils/Api';

/**
 * The home page component showing on the initial pageload
 */
class HomePage extends React.Component {
    /** keyword variable needed temporary store search keyword */
    keyword = '';

    constructor(props, context) {
        super(props, context);

        this.state = {
            sideinfo: {
                videonr: null,
                fullhdvideonr: null,
                hdvideonr: null,
                sdvideonr: null,
                tagnr: null
            },
            subtitle: 'All Videos',
            data: [],
            selectionnr: 0
        };
    }

    componentDidMount() {
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
    fetchVideoData(tag) {
        callAPI('video.php', {action: 'getMovies', tag: tag}, (result) => {
            this.setState({
                data: []
            });
            this.setState({
                data: result,
                selectionnr: result.length,
                tag: tag + ' Videos'
            });
        });
    }

    /**
     * fetch the necessary data for left info box
     */
    fetchStartData() {
        callAPI('video.php', {action: 'getStartData'}, (result) => {
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

    /**
     * search for a keyword in db and update previews
     *
     * @param keyword The keyword to search for
     */
    searchVideos(keyword) {
        console.log('search called');

        callAPI('video.php', {action: 'getSearchKeyWord', keyword: keyword}, (result) => {
            this.setState({
                data: []
            });
            this.setState({
                data: result,
                selectionnr: result.length,
                tag: 'Search result: ' + keyword
            });
        });
    }

    render() {
        return (
            <>
                <PageTitle
                    title='Home Page'
                    subtitle={this.state.subtitle + ' - ' + this.state.selectionnr}>
                    <form className={'form-inline ' + style.searchform} onSubmit={(e) => {
                        e.preventDefault();
                        this.searchVideos(this.keyword);
                    }}>
                        <input data-testid='searchtextfield' className='form-control mr-sm-2'
                               type='text' placeholder='Search'
                               onChange={(e) => {
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
                    <Tag tagInfo={{tag_name: 'All', tag_id: -1}} onclick={() => this.fetchVideoData('All')}/>
                    <Tag tagInfo={{tag_name: 'FullHd', tag_id: -1}} onclick={() => this.fetchVideoData('FullHd')}/>
                    <Tag tagInfo={{
                        tag_name: 'LowQuality',
                        tag_id: -1
                    }} onclick={() => this.fetchVideoData('LowQuality')}/>
                    <Tag tagInfo={{tag_name: 'HD', tag_id: -1}} onclick={() => this.fetchVideoData('HD')}/>
                </SideBar>
                {this.state.data.length !== 0 ?
                    <VideoContainer
                        data={this.state.data}/> :
                    <div>No Data found!</div>}
                <div className={style.rightinfo}>

                </div>

            </>
        );
    }
}

export default HomePage;
