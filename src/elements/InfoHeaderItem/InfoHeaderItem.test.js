import {shallow} from "enzyme";
import React from "react";
import InfoHeaderItem from "./InfoHeaderItem";

describe('<InfoHeaderItem/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<InfoHeaderItem/>);
        wrapper.unmount();
    });

    it('renders correct text', function () {
        const wrapper = shallow(<InfoHeaderItem text='mytext'/>);
        expect(wrapper.find(".maintext").text()).toBe("mytext");
    });

    it('renders correct subtext', function () {
        const wrapper = shallow(<InfoHeaderItem text ="mimi" subtext='testtext'/>);
        expect(wrapper.find(".subtext").text()).toBe("testtext");
    });

    it('test no subtext if no text defined', function () {
        const wrapper = shallow(<InfoHeaderItem subtext='testi'/>);
        expect(wrapper.find(".subtext")).toHaveLength(0);
    });

    it('test custom click handler', function () {
        const func = jest.fn();
        const wrapper = shallow(<InfoHeaderItem onClick={() => func()}/>);
        expect(func).toBeCalledTimes(0);
        wrapper.simulate("click");
        expect(func).toBeCalledTimes(1);
    });

    it('test insertion of loading spinner', function () {
        const wrapper = shallow(<InfoHeaderItem text={null}/>);
        expect(wrapper.find("Spinner").length).toBe(1);
    });

    it('test loading spinner if undefined', function () {
        const wrapper = shallow(<InfoHeaderItem/>);
        expect(wrapper.find("Spinner").length).toBe(1);
    });
});
