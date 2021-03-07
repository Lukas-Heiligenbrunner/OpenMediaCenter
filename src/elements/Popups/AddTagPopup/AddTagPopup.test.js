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
});
