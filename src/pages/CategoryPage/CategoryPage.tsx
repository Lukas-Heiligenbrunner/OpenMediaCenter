import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {CategoryViewWR} from './CategoryView';
import TagView from './TagView';

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
class CategoryPage extends React.Component {
    render(): JSX.Element {
        return (
            <Switch>
                <Route path='/categories/:id'>
                    <CategoryViewWR/>
                </Route>
                <Route path='/categories'>
                    <TagView/>
                </Route>
            </Switch>
        );
    }
}

export default CategoryPage;
