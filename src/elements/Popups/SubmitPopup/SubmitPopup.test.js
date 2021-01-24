import {shallow} from "enzyme";
import React from "react";
import SubmitPopup from "./SubmitPopup";

describe('<SubmitPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<SubmitPopup/>);
        wrapper.unmount();
    });
});
