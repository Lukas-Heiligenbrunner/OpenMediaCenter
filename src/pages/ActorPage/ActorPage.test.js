import {shallow} from "enzyme";
import React from "react";
import ActorPage from "./ActorPage";

describe('<ActorPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorPage/>);
        wrapper.unmount();
    });


});
