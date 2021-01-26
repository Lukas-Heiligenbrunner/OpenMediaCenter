import {shallow} from 'enzyme';
import React from 'react';
import CategoryPage from './CategoryPage';

describe('<CategoryPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<CategoryPage/>);
        wrapper.unmount();
    });
});
