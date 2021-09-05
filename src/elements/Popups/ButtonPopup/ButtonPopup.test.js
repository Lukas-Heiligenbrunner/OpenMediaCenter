import {shallow} from 'enzyme';
import React from 'react';
import {ButtonPopup} from './ButtonPopup';
import exp from "constants";

describe('<ButtonPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ButtonPopup/>);
        wrapper.unmount();
    });

    it('renders two buttons', function () {
        const wrapper = shallow(<ButtonPopup/>);
        expect(wrapper.find('Button')).toHaveLength(2);
    });

    it('renders three buttons if alternative defined', function () {
        const wrapper = shallow(<ButtonPopup AlternativeButtonTitle='alt'/>);
        expect(wrapper.find('Button')).toHaveLength(3);
    });

    it('test click handlings', function () {
        const althandler = jest.fn();
        const denyhandler = jest.fn();
        const submithandler = jest.fn();

        const wrapper = shallow(<ButtonPopup DenyButtonTitle='deny' onDeny={denyhandler} SubmitButtonTitle='submit'
                                             onSubmit={submithandler} AlternativeButtonTitle='alt'
                                             onAlternativeButton={althandler}/>);
        wrapper.find('Button').findWhere(e => e.props().title === "deny").simulate('click');
        expect(denyhandler).toHaveBeenCalledTimes(1);

        wrapper.find('Button').findWhere(e => e.props().title === "alt").simulate('click');
        expect(althandler).toHaveBeenCalledTimes(1);

        wrapper.find('Button').findWhere(e => e.props().title === "submit").simulate('click');
        expect(submithandler).toHaveBeenCalledTimes(1);
    });

    it('test Parentsubmit and parenthide callbacks', function () {
        const ondeny = jest.fn();
        const onsubmit = jest.fn();

        const wrapper = shallow(<ButtonPopup DenyButtonTitle='deny' SubmitButtonTitle='submit' onDeny={ondeny} onSubmit={onsubmit} AlternativeButtonTitle='alt'/>);
        wrapper.find('PopupBase').props().onHide();
        expect(ondeny).toHaveBeenCalledTimes(1);

        wrapper.find('PopupBase').props().ParentSubmit();
        expect(onsubmit).toHaveBeenCalledTimes(1);
    });
});
