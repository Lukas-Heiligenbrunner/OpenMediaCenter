import React from "react";
import SideBar from "./SideBar";

import "@testing-library/jest-dom"
import {shallow} from "enzyme";

describe('<SideBar/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<SideBar/>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<SideBar>test</SideBar>);
        expect(wrapper.children().text()).toBe("test");
    });
});
