import {shallow} from 'enzyme';
import React from 'react';
import VideoContainer from './VideoContainer';

describe('<VideoContainer/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<VideoContainer data={[]}/>);
        wrapper.unmount();
    });

    it('inserts tiles correctly if enough available', () => {
        const wrapper = shallow(<VideoContainer data={[
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
        ]}/>);
        expect(wrapper.find('Preview')).toHaveLength(16);
    });

    it('inserts tiles correctly if not enough available', () => {
        const wrapper = shallow(<VideoContainer data={[
            {}, {}, {}, {}
        ]}/>);
        expect(wrapper.find('Preview')).toHaveLength(4);
    });

    it('no items available', () => {
        const wrapper = shallow(<VideoContainer data={[]}/>);
        expect(wrapper.find('Preview')).toHaveLength(0);
        expect(wrapper.find('.maincontent').text()).toBe('no items to show!');
    });
});
