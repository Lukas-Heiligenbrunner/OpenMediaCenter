import React from 'react';

import {shallow} from 'enzyme';
import '@testing-library/jest-dom';
import NewActorPopup from './NewActorPopup';

describe('<NewActorPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<NewActorPopup/>);
        wrapper.unmount();
    });
});
