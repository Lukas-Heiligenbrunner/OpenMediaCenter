import React from 'react';
import SideBar, {SideBarTitle} from '../../elements/SideBar/SideBar';
import Tag from '../../elements/Tag/Tag';
import NewTagPopup from '../../elements/Popups/NewTagPopup/NewTagPopup';
import PageTitle, {Line} from '../../elements/PageTitle/PageTitle';
import {Route, Switch} from 'react-router-dom';
import {DefaultTags} from '../../types/GeneralTypes';
import {CategoryViewWR} from './CategoryView';
import TagView from './TagView';


interface CategoryPageState {
    popupvisible: boolean;
    subtitle: string;
}

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
class CategoryPage extends React.Component<{}, CategoryPageState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            popupvisible: false,
            subtitle: ''
        };

        this.setSubTitle = this.setSubTitle.bind(this);
    }

    render(): JSX.Element {
        return (
            <>
                <PageTitle
                    title='Categories'
                    subtitle={this.state.subtitle}/>

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
                </SideBar>
                <Switch>
                    <Route path='/categories/:id'>
                        <CategoryViewWR setSubTitle={this.setSubTitle}/>
                    </Route>
                    <Route path='/categories'>
                        <TagView setSubTitle={this.setSubTitle}/>
                    </Route>
                </Switch>

                {this.state.popupvisible ?
                    <NewTagPopup onHide={(): void => {
                        this.setState({popupvisible: false});
                        // this.loadTags();
                    }}/> :
                    null
                }
            </>
        );
    }

    /**
     * set the subtitle of this page
     * @param subtitle string as subtitle
     */
    setSubTitle(subtitle: string): void {
        this.setState({subtitle: subtitle});
    }
}

export default CategoryPage;
