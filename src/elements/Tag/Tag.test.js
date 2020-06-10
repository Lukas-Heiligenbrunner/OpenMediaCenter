import React from "react";
import Tag from './Tag'

import "@testing-library/jest-dom"
import {shallow} from 'enzyme'

describe('<Tag/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Tag>test</Tag>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<Tag>test</Tag>);
        expect(wrapper.children().text()).toBe("test");
    });
});
