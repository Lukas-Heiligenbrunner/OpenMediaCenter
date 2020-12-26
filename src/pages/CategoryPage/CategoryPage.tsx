import React from 'react';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import NewTagPopup from '../../elements/Popups/NewTagPopup/NewTagPopup';
import {Line} from '../../elements/PageTitle/PageTitle';
import {Route, Switch} from 'react-router-dom';
import {DefaultTags} from '../../api/GeneralTypes';
import {CategoryViewWR} from './CategoryView';
import TagView from './TagView';


interface CategoryPageState {
    popupvisible: boolean
}

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
class CategoryPage extends React.Component<{}, CategoryPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            popupvisible: false
        };
    }

    /**
     * render the Title and SideBar component for the Category page
     * @returns {JSX.Element} corresponding jsx element for Title and Sidebar
     */
    renderSideBarATitle(): JSX.Element {
        return (
            <>
                <SideBar>
                    <SideBarTitle>Default Tags:</SideBarTitle>
                    <Tag tagInfo={DefaultTags.all}/>
                    <Tag tagInfo={DefaultTags.fullhd}/>
                    <Tag tagInfo={DefaultTags.hd}/>
                    <Tag tagInfo={DefaultTags.lowq}/>

                    <Line/>
                    <button data-testid='btnaddtag' className='btn btn-success' onClick={(): void => {
                        this.setState({popupvisible: true});
                    }}>Add a new Tag!
                    </button>
                </SideBar></>
        );
    }

    render(): JSX.Element {
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
                                 onHide={(): void => {
                                     this.setState({popupvisible: false});
                                     // this.loadTags();
                                 }}/> :
                    null
                }
            </>
        );
    }
}

export default CategoryPage;
