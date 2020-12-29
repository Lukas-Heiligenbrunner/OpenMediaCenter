import {shallow} from 'enzyme';
import React from 'react';
import SettingsPage from './SettingsPage';

describe('<RandomPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<SettingsPage/>);
        wrapper.unmount();
    });
});
