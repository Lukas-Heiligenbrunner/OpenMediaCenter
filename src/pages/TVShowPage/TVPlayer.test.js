import {shallow} from 'enzyme';
import {TVPlayer} from './TVPlayer';
import React from 'react';

describe('<TVPlayer/>', () => {
    it('renders without crashing', function () {
        const wrapper = shallow(<TVPlayer match={{params: {id: 42}}}/>);
        wrapper.unmount();
    });
})
