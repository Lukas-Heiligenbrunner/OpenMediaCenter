import {shallow} from 'enzyme';
import React from 'react';
import {HomePage, SortBy} from './HomePage';
import VideoContainer from '../../elements/VideoContainer/VideoContainer';
import {SearchHandling} from './SearchHandling';
import exp from "constants";
import {DefaultTags} from "../../types/GeneralTypes";

describe('<HomePage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<HomePage/>);
        wrapper.unmount();
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
        global.fetch = prepareFetchApi({Videos: ['test1', 'test2'], TagName: 'all'});

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

    it('test sortby type change', function () {
        const wrapper = shallow(<HomePage/>);

        // expect those default values
        expect(wrapper.state().sortby).toBe(0);
        expect(wrapper.instance().tagState).toBe(DefaultTags.all);

        wrapper.instance().onDropDownItemClick(SortBy.name);

        expect(wrapper.state().sortby).toBe(SortBy.name);
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
