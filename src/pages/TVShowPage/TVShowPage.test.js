import {shallow} from 'enzyme';
import {TVShowPage} from './TVShowPage';
import React from 'react';

describe('<TVShowPage/>', () => {
    it('renders without crashing', function () {
        const wrapper = shallow(<TVShowPage />);
        wrapper.unmount();
    });
})
