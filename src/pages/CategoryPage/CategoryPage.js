import React from 'react';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import videocontainerstyle from '../../elements/VideoContainer/VideoContainer.module.css';

import {TagPreview} from '../../elements/Preview/Preview';
import NewTagPopup from '../../elements/Popups/NewTagPopup/NewTagPopup';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {Link, Redirect, Route, Switch, withRouter} from 'react-router-dom';

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
class CategoryPage extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            loadedtags: [],
            selected: null
        };

        console.log(props);
    }

    componentDidMount() {
        // check if predefined category is set
        if (this.props.category) {
            this.fetchVideoData(this.props.category);
        } else {
            // this.loadTags();
        }
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
                    subtitle={!this.state.selected ? this.state.loadedtags.length + ' different Tags' : this.state.selected}/>

                <SideBar>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag onclick={(tag) => {this.loadTag(tag);}}>All</Tag>
                    <Tag onclick={(tag) => {this.loadTag(tag);}}>FullHd</Tag>
                    <Tag onclick={(tag) => {this.loadTag(tag);}}>LowQuality</Tag>
                    <Tag onclick={(tag) => {this.loadTag(tag);}}>HD</Tag>
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
                        <>
                            {this.videodata ?
                                <VideoContainer
                                    data={this.videodata}/> : null}
                            <button data-testid='backbtn' className='btn btn-success'
                                    onClick={this.loadCategoryPageDefault}>Back
                            </button>
                        </>
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
                                     this.loadTags();
                                 }}/> :
                    null
                }

            </>
        );
    }

    /**
     * fetch data for a specific tag from backend
     * @param tag tagname
     */
    fetchVideoData(tag) {
        console.log(tag);
        const updateRequest = new FormData();
        updateRequest.append('action', 'getMovies');
        updateRequest.append('tag', tag);

        console.log('fetching data');

        // fetch all videos available
        fetch('/api/video.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.videodata = result;
                    this.setState({selected: null}); // needed to trigger the state reload correctly
                    this.setState({selected: tag});
                }))
            .catch(() => {
                console.log('no connection to backend');
            });
    }

    /**
     * go back to the default category overview
     */
    loadCategoryPageDefault = () => {
        this.setState({selected: null});
        this.loadTags();
    };
}

class TagView extends React.Component {
    constructor(props) {
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
                        <Link to={'/categories/'+m.tag_id}><TagPreview
                            key={m.tag_name}
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
        const updateRequest = new FormData();
        updateRequest.append('action', 'getAllTags');

        // fetch all videos available
        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({loadedtags: result});
                }))
            .catch(() => {
                console.log('no connection to backend');
            });
    }
}

export default CategoryPage;
