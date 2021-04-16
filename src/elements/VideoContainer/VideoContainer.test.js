import {shallow} from 'enzyme';
import React from 'react';
import VideoContainer from './VideoContainer';

describe('<VideoContainer/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<VideoContainer data={[]}/>);
        wrapper.unmount();
    });
});
