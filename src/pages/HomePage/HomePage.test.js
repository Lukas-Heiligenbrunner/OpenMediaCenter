import {shallow} from 'enzyme';
import React from 'react';
import HomePage from './HomePage';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';

describe('<HomePage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<HomePage/>);
        wrapper.unmount();
    });

    it('test data insertion', function () {
        const wrapper = shallow(<HomePage/>);

        expect(wrapper.find('VideoContainer')).toHaveLength(0);

        wrapper.setState({
            data: [
                {}, {}
            ]
        });

        // there shoud be loaded the Videocontainer element into dom after fetching videos correctly
        expect(wrapper.find('VideoContainer')).toHaveLength(1);
    });

    it('test title and nr insertions', function () {
        const wrapper = shallow(<HomePage/>);

        expect(wrapper.find('PageTitle').props().subtitle).toBe('All Videos - 0');

        wrapper.setState({
            subtitle: 'testsubtitle',
            selectionnr: 42
        });

        expect(wrapper.find('PageTitle').props().subtitle).toBe('testsubtitle - 42');
    });

    it('test search field', done => {
        global.fetch = global.prepareFetchApi([{}, {}]);

        const wrapper = shallow(<HomePage/>);

        wrapper.find('[data-testid="searchtextfield"]').simulate('change', {target: {value: 'testvalue'}});
        wrapper.find('[data-testid="searchbtnsubmit"]').simulate('click');

        process.nextTick(() => {
            // state to be set correctly with response
            expect(wrapper.state().selectionnr).toBe(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('test form submit', done => {
        global.fetch = global.prepareFetchApi([{}, {}]);

        const wrapper = shallow(<HomePage/>);

        const fakeEvent = {preventDefault: () => console.log('preventDefault')};
        wrapper.find('.searchform').simulate('submit', fakeEvent);

        expect(wrapper.state().selectionnr).toBe(0);

        process.nextTick(() => {
            // state to be set correctly with response
            expect(wrapper.state().selectionnr).toBe(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('test no backend connection behaviour', done => {
        // this test assumes a console.log within every connection fail
        global.fetch = global.prepareFailingFetchApi();

        let count = 0;
        global.console.log = jest.fn(() => {
            count++;
        });

        shallow(<HomePage/>);

        process.nextTick(() => {
            // state to be set correctly with response
            expect(global.fetch).toBeCalledTimes(2);

            global.fetch.mockClear();
            done();
        });
    });
});
