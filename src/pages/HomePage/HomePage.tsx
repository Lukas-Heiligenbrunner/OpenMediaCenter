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
import {DefaultTags} from '../../types/GeneralTypes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSortDown} from '@fortawesome/free-solid-svg-icons';

export enum SortBy {
    date,
    likes,
    random,
    name,
    length
}

interface Props extends RouteComponentProps {}

interface state {
    sideinfo: VideoTypes.startDataType;
    subtitle: string;
    data: VideoTypes.VideoUnloadedType[];
    selectionnr: number;
    sortby: string;
}

/**
 * The home page component showing on the initial pageload
 */
export class HomePage extends React.Component<Props, state> {
    /** keyword variable needed temporary store search keyword */
    keyword = '';

    constructor(props: Props) {
        super(props);

        this.state = {
            sideinfo: {
                VideoNr: 0,
                FullHdNr: 0,
                HDNr: 0,
                SDNr: 0,
                DifferentTags: 0,
                Tagged: 0
            },
            subtitle: 'All Videos',
            data: [],
            selectionnr: 0,
            sortby: 'Date Added'
        };
    }

    sortState = SortBy.date;
    tagState = DefaultTags.all;

    componentDidMount(): void {
        // initial get of all videos
        this.fetchVideoData();
        this.fetchStartData();
    }

    /**
     * fetch available videos for specified tag
     * this function clears all preview elements an reloads gravity with tag
     *
     * @param tag tag to fetch videos
     */
    fetchVideoData(): void {
        callAPI(
            APINode.Video,
            {action: 'getMovies', Tag: this.tagState.TagId, Sort: this.sortState},
            (result: {Videos: VideoTypes.VideoUnloadedType[]; TagName: string}) => {
                this.setState({
                    data: result.Videos,
                    selectionnr: result.Videos.length
                });
            }
        );
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
                        <SearchHandling />
                    </Route>
                    <Route path='/'>
                        <PageTitle title='Home Page' subtitle={this.state.subtitle + ' - ' + this.state.selectionnr}>
                            <form
                                className={'form-inline ' + style.searchform}
                                onSubmit={(e): void => {
                                    e.preventDefault();
                                    this.props.history.push('/search/' + this.keyword);
                                }}>
                                <input
                                    data-testid='searchtextfield'
                                    className='form-control mr-sm-2'
                                    type='text'
                                    placeholder='Search'
                                    onChange={(e): void => {
                                        this.keyword = e.target.value;
                                    }}
                                />
                                <button data-testid='searchbtnsubmit' className='btn btn-success' type='submit'>
                                    Search
                                </button>
                            </form>
                        </PageTitle>
                        <SideBar>
                            <SideBarTitle>Infos:</SideBarTitle>
                            <Line />
                            <SideBarItem>
                                <b>{this.state.sideinfo.VideoNr}</b> Videos Total!
                            </SideBarItem>
                            <SideBarItem>
                                <b>{this.state.sideinfo.FullHdNr}</b> FULL-HD Videos!
                            </SideBarItem>
                            <SideBarItem>
                                <b>{this.state.sideinfo.HDNr}</b> HD Videos!
                            </SideBarItem>
                            <SideBarItem>
                                <b>{this.state.sideinfo.SDNr}</b> SD Videos!
                            </SideBarItem>
                            <SideBarItem>
                                <b>{this.state.sideinfo.DifferentTags}</b> different Tags!
                            </SideBarItem>
                            <Line />
                            <SideBarTitle>Default Tags:</SideBarTitle>
                            <Tag
                                tagInfo={{TagName: 'All', TagId: DefaultTags.all.TagId}}
                                onclick={(): void => {
                                    this.tagState = DefaultTags.all;
                                    this.fetchVideoData();
                                    this.setState({subtitle: 'All Videos'});
                                }}
                            />
                            <Tag
                                tagInfo={{TagName: 'Full Hd', TagId: DefaultTags.fullhd.TagId}}
                                onclick={(): void => {
                                    this.tagState = DefaultTags.fullhd;
                                    this.fetchVideoData();
                                    this.setState({subtitle: 'Full Hd Videos'});
                                }}
                            />
                            <Tag
                                tagInfo={{TagName: 'Low Quality', TagId: DefaultTags.lowq.TagId}}
                                onclick={(): void => {
                                    this.tagState = DefaultTags.lowq;
                                    this.fetchVideoData();
                                    this.setState({subtitle: 'Low Quality Videos'});
                                }}
                            />
                            <Tag
                                tagInfo={{TagName: 'HD', TagId: DefaultTags.hd.TagId}}
                                onclick={(): void => {
                                    this.tagState = DefaultTags.hd;
                                    this.fetchVideoData();
                                    this.setState({subtitle: 'HD Videos'});
                                }}
                            />
                        </SideBar>
                        <div>
                            <span className={style.sortbyLabel}>Sort By: </span>
                            <div className={style.dropdown}>
                                <span className={style.dropbtn}>
                                    <span>{this.state.sortby}</span>
                                    <FontAwesomeIcon style={{marginLeft: 3, paddingBottom: 3}} icon={faSortDown} size='1x' />
                                </span>
                                <div className={style.dropdownContent}>
                                    <span onClick={(): void => this.onDropDownItemClick(SortBy.date, 'Date Added')}>Date Added</span>
                                    <span onClick={(): void => this.onDropDownItemClick(SortBy.likes, 'Most likes')}>Most likes</span>
                                    <span onClick={(): void => this.onDropDownItemClick(SortBy.random, 'Random')}>Random</span>
                                    <span onClick={(): void => this.onDropDownItemClick(SortBy.name, 'Name')}>Name</span>
                                    <span onClick={(): void => this.onDropDownItemClick(SortBy.length, 'Length')}>Length</span>
                                </div>
                            </div>
                        </div>

                        <VideoContainer data={this.state.data} />
                        <div className={style.rightinfo} />
                    </Route>
                </Switch>
            </>
        );
    }

    /**
     * click handler for sortby dropdown item click
     * @param type type of sort action
     * @param name new header title
     */
    onDropDownItemClick(type: SortBy, name: string): void {
        this.sortState = type;
        this.setState({sortby: name});
        this.fetchVideoData();
    }
}

export default withRouter(HomePage);
