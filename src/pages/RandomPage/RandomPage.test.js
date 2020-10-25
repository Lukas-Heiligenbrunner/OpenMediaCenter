import {shallow} from 'enzyme';
import React from 'react';
import RandomPage from './RandomPage';

describe('<RandomPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<RandomPage/>);
        wrapper.unmount();
    });

    it('test shuffleload fetch', function () {
        global.fetch = global.prepareFetchApi({});

        shallow(<RandomPage/>);

        expect(global.fetch).toBeCalledTimes(1);
    });

    it('btnshuffle click test', function () {
        global.fetch = global.prepareFetchApi({});

        const wrapper = shallow(<RandomPage/>);

        // simulate at least one existing element
        wrapper.setState({
            videos: [
                {}
            ]
        });

        wrapper.find('.btnshuffle').simulate('click');

        expect(global.fetch).toBeCalledTimes(2);
    });

    it('test tags in random selection', function () {
        const wrapper = shallow(<RandomPage/>);

        wrapper.setState({
            tags: [
                {tag_name: 'test1'},
                {tag_name: 'test2'}
            ]
        });

        expect(wrapper.find('Tag')).toHaveLength(2);
    });
});
