import {shallow} from "enzyme";
import React from "react";
import PopupBase from "./PopupBase";

describe('<PopupBase/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<PopupBase/>);
        wrapper.unmount();
    });


});
