import {shallow} from 'enzyme';
import React from 'react';
import {CategoryView} from './CategoryView';

describe('<CategoryView/>', function () {
    function instance() {
        const inst = shallow(<CategoryView match={{params: {id: 10}}} history={{push: jest.fn()}}/>);
        inst.setState({loaded: true});
        return inst;
    }

    it('renders without crashing ', function () {
        const wrapper = instance();
        wrapper.unmount();
    });

    it('test backbutton', function () {
        const wrapper = instance();
        const func = jest.fn();
        wrapper.setProps({history: {push: func}});

        expect(func).toHaveBeenCalledTimes(0);
        wrapper.find('button').simulate('click');
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('test delete of tag', function () {
        const wrapper = instance();
        callAPIMock({result: 'success'});

        // simulate button click
        wrapper.find('Button').props().onClick();

        expect(wrapper.instance().props.history.push).toHaveBeenCalledTimes(1);
    });

    it('test delete of non empty tag', function () {
        const wrapper = instance();
        callAPIMock({result: 'not empty tag'});

        // simulate button click
        wrapper.find('Button').props().onClick();

        // expect SubmitPopup showing
        expect(wrapper.find('SubmitPopup')).toHaveLength(1);

        // mock deleteTag function
        wrapper.instance().deleteTag = jest.fn((v) => {});

        // simulate submit
        wrapper.find('SubmitPopup').props().submit();

        // expect deleteTag function to have been called with force parameter
        expect(wrapper.instance().deleteTag).toHaveBeenCalledWith(true);
    });

    it('test cancel of ', function () {
        const wrapper = instance();
        callAPIMock({result: 'not empty tag'});

        // simulate button click
        wrapper.find('Button').props().onClick();

        // expect SubmitPopup showing
        expect(wrapper.find('SubmitPopup')).toHaveLength(1);

        // mock deleteTag function
        wrapper.instance().deleteTag = jest.fn((v) => {});

        // simulate submit
        wrapper.find('SubmitPopup').props().onHide();

        // expect deleteTag function to have been called with force parameter
        expect(wrapper.instance().deleteTag).toHaveBeenCalledTimes(0);
    });
});
