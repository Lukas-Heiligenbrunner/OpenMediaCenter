import {shallow} from "enzyme";
import React from "react";
import TVShows from "./TVShows";

describe('<TVShows/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<TVShows/>);
        wrapper.unmount();
    });


});
