import React from 'react';
import AuthenticationPage from './AuthenticationPage';
import {shallow} from 'enzyme';

describe('<AuthenticationPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AuthenticationPage submit={() => {}}/>);
        wrapper.unmount();
    });

    it('test button click', function () {
        let pass;
        const func = jest.fn((pwd) => {pass = pwd});
        const wrapper = shallow(<AuthenticationPage submit={func}/>);
        wrapper.setState({pwdText: 'testpwd'});
        wrapper.find('Button').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
        expect(pass).toBe('testpwd');
    });
});
