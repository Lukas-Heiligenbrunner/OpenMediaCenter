import {shallow} from 'enzyme';
import React from 'react';
import MovieSettings from './MovieSettings';
import {callAPI} from "../../utils/Api";

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

    it('test failing reindex start', done => {
        global.fetch = global.prepareFetchApi({success: false});
        const wrapper = shallow(<MovieSettings/>);

        wrapper.find('button').findWhere(e => e.text() === 'Reindex Movie' && e.type() === 'button').simulate('click');

        // initial send of reindex request to server
        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            // reindex already running --> so disable startbdn
            expect(wrapper.state()).toMatchObject({startbtnDisabled: true});

            global.fetch.mockClear();
            done();
        });
    });

    it('content available received and in state', done => {
        const wrapper = shallow(<MovieSettings/>);
        callAPIMock({
            contentAvailable: true,
            message: ['firstline', 'secondline']
        })

        wrapper.instance().updateStatus();

        expect(wrapper.state()).toMatchObject({
            text: [
                'firstline',
                'secondline'
            ]
        });
    });

    it('test reindex with no content available', () => {
        callAPIMock({
            Messages: [],
            ContentAvailable: false
        })

        global.clearInterval = jest.fn();

        const wrapper = shallow(<MovieSettings/>);
        wrapper.instance().updateStatus();

        // expect the refresh interval to be cleared
        expect(global.clearInterval).toBeCalledTimes(1);

        // expect startbtn to be reenabled
        expect(wrapper.state()).toMatchObject({startbtnDisabled: false});
    });

    it('test simulate gravity cleanup', () => {
        // global.fetch = global.prepareFetchApi('mmi');
        callAPIMock({})
        const wrapper = shallow(<MovieSettings/>);
        wrapper.instance().setState = jest.fn();

        wrapper.find('button').findWhere(e => e.text() === 'Cleanup Gravity' && e.type() === 'button').simulate('click');

        // initial send of reindex request to server
        expect(callAPI).toBeCalledTimes(1);

        expect(wrapper.instance().setState).toBeCalledTimes(1);
    });

    it('test no textDiv insertion if string is empty', function () {
        const wrapper = shallow(<MovieSettings/>);

        callAPIMock({
            ContentAvailable: true,
            Messages: ['test']
        })

        wrapper.instance().updateStatus();

        expect(wrapper.state()).toMatchObject({
            text: ['test']
        });

        // expect an untouched state if we try to add an empty string...
        callAPIMock({
            ContentAvailable: true,
            Messages: ['']
        })

        wrapper.instance().updateStatus();

        expect(wrapper.state()).toMatchObject({
            text: ['test']
        });
    });
});
