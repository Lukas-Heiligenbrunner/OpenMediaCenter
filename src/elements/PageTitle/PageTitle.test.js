import React from 'react';
import {shallow} from 'enzyme'

import PageTitle from "./PageTitle";

describe('<Preview/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<PageTitle/>);
        wrapper.unmount();
    });
});

