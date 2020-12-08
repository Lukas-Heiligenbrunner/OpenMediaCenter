import {shallow} from 'enzyme';
import React from 'react';
import AddActorPopup from './AddActorPopup';

describe('<AddActorPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AddActorPopup/>);
        wrapper.unmount();
    });

    // it('simulate change to other page', function () {
    //     const wrapper = shallow(<AddActorPopup/>);
    //
    //     console.log(wrapper.find('PopupBase').dive().debug());
    //
    //
    //     console.log(wrapper.debug());
    // });
});
