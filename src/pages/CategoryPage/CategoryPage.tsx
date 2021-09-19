import React from 'react';
import {Route, Switch, useRouteMatch} from 'react-router-dom';
import {CategoryViewWR} from './CategoryView';
import TagView from './TagView';

/**
 * Component for Category Page
 * Contains a Tag Overview and loads specific Tag videos in VideoContainer
 */
const CategoryPage = (): JSX.Element => {
    const match = useRouteMatch();

    console.log(match.url);

    return (
        <Switch>
            <Route exact path={`${match.url}/:id`}>
                <CategoryViewWR />
            </Route>
            <Route exact path={`${match.url}/`}>
                <TagView />
            </Route>
        </Switch>
    );
};

export default CategoryPage;
