import React from 'react';
import AuthenticationPage from './AuthenticationPage';
import {shallow} from 'enzyme';
import {token} from "../../utils/TokenHandler";

describe('<AuthenticationPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AuthenticationPage submit={() => {
        }}/>);
        wrapper.unmount();
    });

    it('test button click', function () {
        const func = jest.fn();
        const wrapper = shallow(<AuthenticationPage onSuccessLogin={func}/>);
        wrapper.instance().authenticate = jest.fn(() => {
            wrapper.instance().props.onSuccessLogin()
        });
        wrapper.setState({pwdText: 'testpwd'});

        wrapper.find('Button').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });

    it('test fail authenticate', function () {
        const events = mockKeyPress();

        token.refreshAPIToken = jest.fn().mockImplementation((callback, force, pwd) => {
            callback('there was an error')
        });

        const wrapper = shallow(<AuthenticationPage/>);

        events.keyup({key: 'Enter'});

        expect(wrapper.state().wrongPWDInfo).toBe(true);
    });

    it('test success authenticate', function () {
        const events = mockKeyPress();
        const func = jest.fn()

        token.refreshAPIToken = jest.fn().mockImplementation((callback, force, pwd) => {
            callback('')
        });

        const wrapper = shallow(<AuthenticationPage onSuccessLogin={func}/>);

        events.keyup({key: 'Enter'});

        expect(wrapper.state().wrongPWDInfo).toBe(false);
        expect(func).toHaveBeenCalledTimes(1);
    });
});
