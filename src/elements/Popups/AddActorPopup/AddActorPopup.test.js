import {shallow} from 'enzyme';
import React from 'react';
import AddActorPopup from './AddActorPopup';

describe('<AddActorPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AddActorPopup/>);
        wrapper.unmount();
    });


});
