import {shallow} from 'enzyme';
import React from 'react';
import DynamicContentContainer from './DynamicContentContainer';

describe('<DynamicContentContainer/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<DynamicContentContainer data={[]} renderElement={(el) => (<></>)}/>);
        wrapper.unmount();
    });

    it('inserts tiles correctly if enough available', () => {
        const wrapper = shallow(<DynamicContentContainer data={[
            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
        ]} renderElement={(el) => (<a/>)}/>);
        expect(wrapper.find('a')).toHaveLength(16);
    });

    it('inserts tiles correctly if not enough available', () => {
        const wrapper = shallow(<DynamicContentContainer data={[
            {}, {}, {}, {}
        ]} renderElement={(el) => (<a/>)}/>);
        expect(wrapper.find('a')).toHaveLength(4);
    });

    it('no items available', () => {
        const wrapper = shallow(<DynamicContentContainer data={[]} renderElement={(el) => (<a/>)}/>);
        expect(wrapper.find('a')).toHaveLength(0);
        expect(wrapper.find('.maincontent').text()).toBe('no items to show!');
    });

    it('test clean', function () {
        const wrapper = shallow(<DynamicContentContainer data={[{}, {}, {}]} renderElement={(el) => (<a/>)}/>);
        expect(wrapper.find('a')).toHaveLength(3);
        wrapper.instance().clean();
        expect(wrapper.find('a')).toHaveLength(0);
    });
});
