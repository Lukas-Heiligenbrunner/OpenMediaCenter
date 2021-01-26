import {shallow} from "enzyme";
import React from "react";
import SubmitPopup from "./SubmitPopup";

describe('<SubmitPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<SubmitPopup/>);
        wrapper.unmount();
    });

    it('test submit click', function () {
        const func = jest.fn();
        const wrapper = shallow(<SubmitPopup submit={() => func()}/>);

        wrapper.find('Button').findWhere(p => p.props().title === 'Submit').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });

    it('test cancel click', function () {
        const func = jest.fn();
        const wrapper = shallow(<SubmitPopup onHide={() => func()}/>);

        wrapper.find('Button').findWhere(p => p.props().title === 'Cancel').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });
});
