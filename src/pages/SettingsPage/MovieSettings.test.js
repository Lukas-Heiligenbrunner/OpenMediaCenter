import {shallow} from 'enzyme';
import React from 'react';
import MovieSettings from './MovieSettings';

describe('<MovieSettings/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<MovieSettings/>);
        wrapper.unmount();
    });

    it('received text renders into dom', function () {
        const wrapper = shallow(<MovieSettings/>);

        wrapper.setState({
            text: [
                'firstline',
                'secline'
            ]
        });

        expect(wrapper.find('.indextextarea').find('.textarea-element')).toHaveLength(2);
    });

    it('test simulate reindex', function () {
        global.fetch = global.prepareFetchApi({success: true});
        const wrapper = shallow(<MovieSettings/>);

        wrapper.find('button').findWhere(e => e.text() === 'Reindex Movie' && e.type() === 'button').simulate('click');

        // initial send of reindex request to server
        expect(global.fetch).toBeCalledTimes(1);
    });
});
