import React from 'react';
import SideBar, {SideBarItem, SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';

import style from './HomePage.module.css';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import {APINode} from '../../utils/Api';
import {Route, Switch, withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';
import SearchHandling from './SearchHandling';
import {VideoTypes} from '../../types/ApiTypes';
import {DefaultTags} from '../../types/GeneralTypes';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSortDown} from '@fortawesome/free-solid-svg-icons';
import APIComponent from '../../elements/APIComponent';
import {TagType} from '../../types/VideoTypes';

// eslint-disable-next-line no-shadow
export enum SortBy {
    date,
    likes,
    random,
    name,
    length
}

interface Props extends RouteComponentProps {}

interface state {
    subtitle: string;
    sortby: string;
    sortState: SortBy;
    tagState: TagType;
}

/**
 * The home page component showing on the initial pageload
 */
export class HomePage extends React.Component<Props, state> {
    /** keyword variable needed temporary store search keyword */
    keyword = '';

    state = {
        subtitle: 'All Videos',
        sortby: 'Date Added',
        sortState: SortBy.date,
        tagState: DefaultTags.all
    };

    render(): JSX.Element {
        return (
            <Switch>
                <Route path='/search/:name'>
                    <SearchHandling />
                </Route>
                <Route path='/'>
                    <APIComponent
                        render={(data: {Videos: VideoTypes.VideoUnloadedType[]; TagName: string}): JSX.Element => (
                            <>
                                <PageTitle title='Home Page' subtitle={this.state.subtitle + ' - ' + data.Videos.length}>
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
                                    <APIComponent
                                        render={(sidebardata: VideoTypes.startDataType): JSX.Element => (
                                            <>
                                                <SideBarTitle>Infos:</SideBarTitle>
                                                <Line />
                                                <SideBarItem>
                                                    <b>{sidebardata.VideoNr}</b> Videos Total!
                                                </SideBarItem>
                                                <SideBarItem>
                                                    <b>{sidebardata.FullHdNr}</b> FULL-HD Videos!
                                                </SideBarItem>
                                                <SideBarItem>
                                                    <b>{sidebardata.HDNr}</b> HD Videos!
                                                </SideBarItem>
                                                <SideBarItem>
                                                    <b>{sidebardata.SDNr}</b> SD Videos!
                                                </SideBarItem>
                                                <SideBarItem>
                                                    <b>{sidebardata.DifferentTags}</b> different Tags!
                                                </SideBarItem>
                                                <Line />
                                                <SideBarTitle>Default Tags:</SideBarTitle>
                                                <Tag
                                                    tagInfo={{TagName: 'All', TagId: DefaultTags.all.TagId}}
                                                    onclick={(): void => {
                                                        this.setState({tagState: DefaultTags.all, subtitle: 'All Videos'});
                                                    }}
                                                />
                                                <Tag
                                                    tagInfo={{TagName: 'Full Hd', TagId: DefaultTags.fullhd.TagId}}
                                                    onclick={(): void => {
                                                        this.setState({tagState: DefaultTags.fullhd, subtitle: 'Full Hd Videos'});
                                                    }}
                                                />
                                                <Tag
                                                    tagInfo={{TagName: 'Low Quality', TagId: DefaultTags.lowq.TagId}}
                                                    onclick={(): void => {
                                                        this.setState({
                                                            tagState: DefaultTags.lowq,
                                                            subtitle: 'Low Quality Videos'
                                                        });
                                                    }}
                                                />
                                                <Tag
                                                    tagInfo={{TagName: 'HD', TagId: DefaultTags.hd.TagId}}
                                                    onclick={(): void => {
                                                        this.setState({tagState: DefaultTags.hd, subtitle: 'HD Videos'});
                                                    }}
                                                />
                                            </>
                                        )}
                                        node={APINode.Video}
                                        action='getStartData'
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
                                            <span onClick={(): void => this.onDropDownItemClick(SortBy.date, 'Date Added')}>
                                                Date Added
                                            </span>
                                            <span onClick={(): void => this.onDropDownItemClick(SortBy.likes, 'Most likes')}>
                                                Most likes
                                            </span>
                                            <span onClick={(): void => this.onDropDownItemClick(SortBy.random, 'Random')}>Random</span>
                                            <span onClick={(): void => this.onDropDownItemClick(SortBy.name, 'Name')}>Name</span>
                                            <span onClick={(): void => this.onDropDownItemClick(SortBy.length, 'Length')}>Length</span>
                                        </div>
                                    </div>
                                </div>
                                <VideoContainer data={data.Videos} />
                                <div className={style.rightinfo} />
                            </>
                        )}
                        node={APINode.Video}
                        action='getMovies'
                        params={{Tag: this.state.tagState.TagId, Sort: this.state.sortState}}
                    />
                </Route>
            </Switch>
        );
    }

    /**
     * click handler for sortby dropdown item click
     * @param type type of sort action
     * @param name new header title
     */
    onDropDownItemClick(type: SortBy, name: string): void {
        this.setState({sortby: name, sortState: type});
    }
}

export default withRouter(HomePage);
