import React from 'react';
import App from './App';
import {shallow} from 'enzyme'

describe('<App/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<App/>);
        wrapper.unmount();
    });

    it('renders title', () => {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('.navbar-brand').text()).toBe('OpenMediaCenter');
    });

    it('are navlinks correct', function () {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('nav').find('li')).toHaveLength(4);
    });
});
