import {shallow} from 'enzyme';
import React from 'react';
import MovieSettings from './MovieSettings';
import {callAPI} from '../../utils/Api';

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
        callAPIMock({success: true})
        const wrapper = shallow(<MovieSettings/>);

        wrapper.find('button').findWhere(e => e.text() === 'Reindex Movie' && e.type() === 'button').simulate('click');

        // initial send of reindex request to server
        expect(callAPI).toBeCalledTimes(1);
    });

    it('test simulate tvshow reindex', function () {
        callAPIMock({success: true})
        const wrapper = shallow(<MovieSettings/>);

        wrapper.find('button').findWhere(e => e.text() === 'TVShow Reindex' && e.type() === 'button').simulate('click');

        // initial send of reindex request to server
        expect(callAPI).toBeCalledTimes(1);
    });

    it('test handlemessage ', function () {
        const wrapper = shallow(<MovieSettings/>);
        const func = jest.fn((str) => {})
        wrapper.instance().appendLog = func
        wrapper.instance().handleMessage('{"Action":"message", "Message":"testmsg"}')

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenLastCalledWith('testmsg')

        wrapper.setState({startbtnDisabled: false});

        // expect button to get disabled!
        wrapper.instance().handleMessage('{"Action":"reindexAction", "Event":"start"}');
        expect(wrapper.state().startbtnDisabled).toBeTruthy()

        // expect button to get enabled
        wrapper.instance().handleMessage('{"Action":"reindexAction", "Event":"stop"}');
        expect(wrapper.state().startbtnDisabled).not.toBeTruthy()
    });

    it('test appendlog', function () {
        const wrapper = shallow(<MovieSettings/>);

        wrapper.instance().appendLog("testmsg");
        expect(wrapper.state().text).toHaveLength(1)
        expect(wrapper.state().text[0]).toBe('testmsg')

        wrapper.instance().appendLog("testmsg2");
        expect(wrapper.state().text).toHaveLength(2)
        expect(wrapper.state().text[0]).toBe('testmsg2')
        expect(wrapper.state().text[1]).toBe('testmsg')
    });
});
