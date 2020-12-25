import {shallow} from "enzyme";
import React from "react";
import ActorOverviewPage from "./ActorOverviewPage";

describe('<ActorOverviewPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorOverviewPage/>);
        wrapper.unmount();
    });


});
