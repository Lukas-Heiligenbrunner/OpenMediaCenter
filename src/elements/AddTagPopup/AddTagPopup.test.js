import React from "react";

import {shallow} from 'enzyme'
import "@testing-library/jest-dom"

import AddTagPopup from "./AddTagPopup";

describe('<AddTagPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.unmount();
    });

    it('test tag insertion', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.setState({
            items: [{tag_id: 1, tag_name: 'test'}, {tag_id: 2, tag_name: "ee"}]
        }, () => {
            expect(wrapper.find('Tag')).toHaveLength(2);
            expect(wrapper.find('Tag').first().dive().text()).toBe("test");
        });
    });

    it('test tag click', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.instance().addTag = jest.fn();

        wrapper.setState({
            items: [{tag_id: 1, tag_name: 'test'}]
        }, () => {
            wrapper.find('Tag').first().dive().simulate('click');
            expect(wrapper.instance().addTag).toHaveBeenCalledTimes(1);
        });
    });

    it('test addtag', done => {
        const wrapper = shallow(<AddTagPopup/>);

        global.fetch = prepareFetchApi({result: "success"});

        wrapper.setProps({
            submit: jest.fn((arg1, arg2) => {}),
            onHide: jest.fn()
        }, () => {
            wrapper.instance().addTag(1, "test");

            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        process.nextTick(() => {
            expect(wrapper.instance().props.submit).toHaveBeenCalledTimes(1);
            expect(wrapper.instance().props.onHide).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });

    it('test failing addTag', done => {
        const wrapper = shallow(<AddTagPopup/>);

        global.fetch = prepareFetchApi({result: "fail"});

        wrapper.setProps({
            submit: jest.fn((arg1, arg2) => {}),
            onHide: jest.fn()
        }, () => {
            wrapper.instance().addTag(1, "test");

            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        process.nextTick(() => {
            expect(wrapper.instance().props.submit).toHaveBeenCalledTimes(0);
            expect(wrapper.instance().props.onHide).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });
});
