import React from 'react';
import SideBar, {SideBarItem, SideBarTitle} from './SideBar';

import '@testing-library/jest-dom';
import {shallow} from 'enzyme';

describe('<SideBar/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<SideBar/>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<SideBar>test</SideBar>);
        expect(wrapper.children().text()).toBe('test');
    });

    it('sidebar Item renders without crashing', function () {
        const wrapper = shallow(<SideBarItem>Test</SideBarItem>);
        expect(wrapper.children().text()).toBe('Test');
    });

    it('renderes sidebartitle correctly', function () {
        const wrapper = shallow(<SideBarTitle>Test</SideBarTitle>);
        expect(wrapper.children().text()).toBe('Test');
    });
});
