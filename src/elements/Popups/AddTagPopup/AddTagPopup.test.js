import React from 'react';

import {shallow} from 'enzyme';
import '@testing-library/jest-dom';

import AddTagPopup from './AddTagPopup';

describe('<AddTagPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.unmount();
    });

    it('test tag insertion', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.setState({
            items: [{TagId: 1, TagName: 'test'}, {TagId: 2, TagName: 'ee'}]
        }, () => {
            expect(wrapper.find('Tag')).toHaveLength(2);
            expect(wrapper.find('Tag').first().dive().text()).toBe('test');
        });
    });

    it('test tag click', function () {
        const wrapper = shallow(<AddTagPopup submit={jest.fn()} onHide={jest.fn()}/>);

        wrapper.setState({
            items: [{TagId: 1, TagName: 'test'}]
        }, () => {
            wrapper.find('Tag').first().dive().simulate('click');
            expect(wrapper.instance().props.submit).toHaveBeenCalledTimes(1);
            expect(wrapper.instance().props.onHide).toHaveBeenCalledTimes(1);
        });
    });

    it('test parent submit if one item left', function () {
        const onhide = jest.fn();
        const submit = jest.fn();

        const wrapper = shallow(<AddTagPopup submit={submit} onHide={onhide}/>);

        wrapper.setState({
            items: [{TagId: 1, TagName: 'test'}]
        }, () => {
            wrapper.instance().parentSubmit();

            expect(onhide).toHaveBeenCalledTimes(1);
            expect(submit).toHaveBeenCalledTimes(1);

            wrapper.setState({
                items: [{TagId: 1, TagName: 'test'}, {TagId: 3, TagName: 'test3'}]
            }, () => {
                wrapper.instance().parentSubmit();

                // expect no submit if there are more than 1 item left...
                expect(onhide).toHaveBeenCalledTimes(1);
                expect(submit).toHaveBeenCalledTimes(1);
            })
        });
    });
});
