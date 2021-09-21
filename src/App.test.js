import React from 'react';
import App from './App';
import {shallow} from 'enzyme';
import GlobalInfos from "./utils/GlobalInfos";
import {LoginContext} from './utils/context/LoginContext';

describe('<App/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<App/>);
        wrapper.unmount();
    });

    it('renders title', () => {
        const wrapper = shallow(<App/>);
        wrapper.setState({password: false});
        expect(wrapper.find('.navbrand').text()).toBe('OpenMediaCenter');
    });

    it('are navlinks correct', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({password: false});
        expect(wrapper.find('.navitem')).toHaveLength(4);
    });

    it('test render of password page', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({password: true});

        expect(wrapper.find('AuthenticationPage')).toHaveLength(1);
    });
});
