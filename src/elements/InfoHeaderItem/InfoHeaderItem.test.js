import {shallow} from "enzyme";
import React from "react";
import InfoHeaderItem from "./InfoHeaderItem";

describe('<InfoHeaderItem/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<InfoHeaderItem/>);
        wrapper.unmount();
    });

    it('renders correct text', function () {
        const wrapper = shallow(<InfoHeaderItem text='testtext'/>);
        expect(wrapper.find(".maintext").text()).toBe("testtext");
    });

    it('renders correct subtext', function () {
        const wrapper = shallow(<InfoHeaderItem subtext='testtext'/>);
        expect(wrapper.find(".subtext").text()).toBe("testtext");
    });

    it('test custom click handler', function () {
        const func = jest.fn();
        const wrapper = shallow(<InfoHeaderItem onClick={() => func()}/>);
        expect(func).toBeCalledTimes(0);
        wrapper.simulate("click");
        expect(func).toBeCalledTimes(1);
    });
});
