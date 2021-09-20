import React from 'react';
import AuthenticationPage from './AuthenticationPage';
import {shallow} from 'enzyme';

describe('<AuthenticationPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AuthenticationPage submit={() => {
        }}/>);
        wrapper.unmount();
    });

    it('test button click', function () {
        const func = jest.fn();
        const wrapper = shallow(<AuthenticationPage />);
        wrapper.instance().authenticate = func;
        wrapper.setState({pwdText: 'testpwd'});

        wrapper.find('Button').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });

    it('test keyenter', function () {
        const events = mockKeyPress();

        const wrapper = shallow(<AuthenticationPage/>);

        const func = jest.fn();
        wrapper.instance().authenticate = func;

        events.keyup({key: 'Enter'});

        expect(func).toHaveBeenCalledTimes(1);
    });
});
