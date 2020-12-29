import {shallow} from 'enzyme';
import React from 'react';
import TagView from './TagView';

describe('<TagView/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<TagView/>);
        wrapper.unmount();
    });

    it('test Tag insertion', function () {
        const wrapper = shallow(<TagView/>);
        wrapper.setState({loadedtags: [{tag_name: 'test', tag_id: 42}]});

        expect(wrapper.find('TagPreview')).toHaveLength(1);
    });
});
