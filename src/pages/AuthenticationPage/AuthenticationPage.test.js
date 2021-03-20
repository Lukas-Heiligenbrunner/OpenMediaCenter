import React from 'react';
import AuthenticationPage from './AuthenticationPage';
import {shallow} from 'enzyme';

describe('<AuthenticationPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AuthenticationPage submit={() => {}}/>);
        wrapper.unmount();
    });

    it('test button click', function () {
        const func = jest.fn();
        const wrapper = shallow(<AuthenticationPage onSuccessLogin={func}/>);
        wrapper.instance().authenticate = jest.fn(() => {wrapper.instance().props.onSuccessLogin()});
        wrapper.setState({pwdText: 'testpwd'});

        wrapper.find('Button').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });
});
