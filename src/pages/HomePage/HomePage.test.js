import {shallow} from 'enzyme';
import React from 'react';
import {HomePage} from './HomePage';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {SearchHandling} from './SearchHandling';

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

    it('test form submit', () => {
        const func = jest.fn();
        const wrapper = shallow(<HomePage/>);
        wrapper.setProps({history: {push: () => func()}});

        const fakeEvent = {preventDefault: () => console.log('preventDefault')};
        wrapper.find('.searchform').simulate('submit', fakeEvent);

        expect(func).toHaveBeenCalledTimes(1);
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

    it('test tag click', done => {
        global.fetch = prepareFetchApi(['test1', 'test2']);

        const wrapper = shallow(<HomePage/>);

        const tags = wrapper.find('SideBar').dive().find('Tag');
        let i = 0;

        function testBtn(e) {
            e.dive().simulate('click');

            process.nextTick(() => {
                process.nextTick(() => {
                    // state to be set correctly with response
                    console.log('see ifits same');
                    expect(wrapper.state()).toMatchObject({data: ['test1', 'test2']});
                    wrapper.state.data = [];
                    i++;
                    if (i >= tags.length) {
                        done();
                    } else {
                        testBtn(tags.at(i));
                    }
                });
            });
        }

        testBtn(tags.first());
    });
});

describe('<SearchHandling/>', () => {
    it('renders without crashing', function () {
        const wrapper = shallow(<SearchHandling match={{params: {name: 'testname'}}}/>);
        wrapper.unmount();
    });

    it('renders videos correctly into container', function () {
        const wrapper = shallow(<SearchHandling match={{params: {name: 'testname'}}}/>);

        wrapper.setState({
            data: [{
                movie_id: 42,
                movie_name: 'testname'
            }]
        });

        // expect video container to be visible
        expect(wrapper.find('VideoContainer')).toHaveLength(1);
    });
});
