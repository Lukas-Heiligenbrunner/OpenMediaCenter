import React from 'react';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import videocontainerstyle from '../../elements/VideoContainer/VideoContainer.module.css';

import {TagPreview} from '../../elements/Preview/Preview';
import NewTagPopup from '../../elements/Popups/NewTagPopup/NewTagPopup';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import {callAPI} from '../../utils/Api';
import {DefaultTags} from "../../api/GeneralTypes";
import {TagType, VideoUnloadedType} from "../../api/VideoTypes";
import {RouteComponentProps} from "react-router";


interface CategoryPageState {
    popupvisible: boolean
}

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
class CategoryPage extends React.Component<{}, CategoryPageState> {
    constructor(props: {}, context: any) {
        super(props, context);

        // this.state = {
        //     loadedtags: [],
        //     selected: null
        // };

        this.state = {
            popupvisible: false
        }
    }

    componentDidMount() {
        // // check if predefined category is set
        // if (this.props.category) {
        //     this.fetchVideoData(this.props.category);
        // } else {
        //     // this.loadTags();
        // }
    }

    /**
     * render the Title and SideBar component for the Category page
     * @returns {JSX.Element} corresponding jsx element for Title and Sidebar
     */
    renderSideBarATitle() {
        return (
            <>
                <PageTitle
                    title='Categories'
                    //subtitle={!this.state.selected ? this.state.loadedtags.length + ' different Tags' : this.state.selected}/>
                    subtitle='temporary'/>

                <SideBar>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag tagInfo={DefaultTags.all}/>
                    <Tag tagInfo={DefaultTags.fullhd}/>
                    <Tag tagInfo={DefaultTags.hd}/>
                    <Tag tagInfo={DefaultTags.lowq}/>

                    <Line/>
                    <button data-testid='btnaddtag' className='btn btn-success' onClick={() => {
                        this.setState({popupvisible: true});
                    }}>Add a new Tag!
                    </button>
                </SideBar></>
        );
    }

    render() {
        return (
            <>
                {this.renderSideBarATitle()}
                <Switch>
                    <Route path='/categories/:id'>
                        <CategoryViewWR/>
                    </Route>
                    <Route path='/categories'>
                        <TagView/>
                    </Route>
                </Switch>

                {this.state.popupvisible ?
                    <NewTagPopup show={this.state.popupvisible}
                                 onHide={() => {
                                     console.error('setstatecalled!');
                                     this.setState({popupvisible: false});
                                     // this.loadTags();
                                 }}/> :
                    null
                }

            </>
        );
    }
}

interface CategoryViewProps extends RouteComponentProps<{ id: string }> {

}

interface CategoryViewState {
    loaded: boolean
}

class CategoryView extends React.Component<CategoryViewProps, CategoryViewState> {
    constructor(props: CategoryViewProps) {
        super(props);

        this.state = {
            loaded: false
        };

        this.fetchVideoData(parseInt(this.props.match.params.id));
    }

    private videodata: VideoUnloadedType[] = [];

    // todo retreive id form url and fetch data

    render() {
        return (
            <>
                {this.state.loaded ?
                    <VideoContainer
                        data={this.videodata}/> : null}

                <button data-testid='backbtn' className='btn btn-success'
                        onClick={() => {
                            this.props.history.push('/categories')
                        }}>Back to Categories
                </button>
            </>
        );
    }

    /**
     * fetch data for a specific tag from backend
     * @param id tagid
     */
    fetchVideoData(id: number): void {
        callAPI('video.php', {action: 'getMovies', tag: id}, result => {
            this.videodata = result;
            this.setState({loaded: true});

            // todo 2020-12-20: how to get tag for title?
            // this.setState({selected: null}); // needed to trigger the state reload correctly
            // this.setState({selected: tag});
        });
    }

}

const CategoryViewWR = withRouter(CategoryView)

interface TagViewState {
    loadedtags: TagType[];
}

class TagView extends React.Component<{}, TagViewState> {
    constructor(props: any) {
        super(props);

        this.state = {loadedtags: []};
    }

    componentDidMount() {
        this.loadTags();
    }

    render() {
        return (
            <div className={videocontainerstyle.maincontent}>
                {this.state.loadedtags ?
                    this.state.loadedtags.map((m) => (
                        <Link to={'/categories/' + m.tag_id}><TagPreview
                            key={m.tag_id}
                            name={m.tag_name}
                            tag_id={m.tag_id}/></Link>
                    )) :
                    'loading'}
            </div>
        );
    }

    /**
     * load all available tags from db.
     */
    loadTags() {
        callAPI('tags.php', {action: 'getAllTags'}, result => {
            this.setState({loadedtags: result});
        });
    }
}

export default CategoryPage;
