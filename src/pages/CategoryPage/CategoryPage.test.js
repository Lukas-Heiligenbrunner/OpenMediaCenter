import {mount, shallow} from 'enzyme';
import React from 'react';
import CategoryPage from './CategoryPage';

describe('<CategoryPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<CategoryPage/>);
        wrapper.unmount();
    });

    it('test tag fetch call', done => {
        global.fetch = global.prepareFetchApi(['first', 'second']);

        const wrapper = shallow(<CategoryPage/>);

        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(wrapper.state().loadedtags.length).toBe(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('test errored fetch call', done => {
        global.fetch = global.prepareFetchApi({});

        let message;
        global.console.log = jest.fn((m) => {
            message = m;
        });

        shallow(<CategoryPage/>);

        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(message).toBe('no connection to backend');

            global.fetch.mockClear();
            done();
        });
    });

    it('test new tag popup', done => {
        const wrapper = shallow(<CategoryPage/>);

        global.fetch = global.prepareFetchApi({});

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
        wrapper.find('[data-testid="btnaddtag"]').simulate('click');
        // newtagpopup should be showing now
        expect(wrapper.find('NewTagPopup')).toHaveLength(1);
        console.error('testlog');
        // click close button in modal

        const func = jest.fn();

        wrapper.find('NewTagPopup').dive().setProps({onHide: func});

        console.error(wrapper.find('NewTagPopup').debug());

        wrapper.find('NewTagPopup').dive().find('button').simulate('click');

        process.nextTick(() => {
            expect(func).toHaveBeenCalledTimes(1);
            // expect(wrapper.state().popupvisible).toBe(false);
            //
            // expect(wrapper.find('NewTagPopup')).toHaveLength(0);

            global.fetch.mockClear();
            done();
        });
    });

    it('test setpage callback', done => {
        global.fetch = global.prepareFetchApi([{}, {}]);

        const wrapper = mount(<CategoryPage/>);

        wrapper.setState({
            loadedtags: [
                {
                    tag_name: 'testname',
                    tag_id: 42
                }
            ]
        });

        wrapper.find('TagPreview').find('div').first().simulate('click');

        process.nextTick(() => {
            // expect callback to have loaded correct tag
            expect(wrapper.state().selected).toBe('testname');

            global.fetch.mockClear();
            done();
        });
    });

    it('test back to category view callback', function () {
        const wrapper = shallow(<CategoryPage/>);

        wrapper.setState({
            selected: 'test'
        });
        expect(wrapper.state().selected).not.toBeNull();
        wrapper.find('[data-testid="backbtn"]').simulate('click');
        expect(wrapper.state().selected).toBeNull();
    });

    it('load categorypage with predefined tag', function () {
        const func = jest.fn();
        CategoryPage.prototype.fetchVideoData = func;

        shallow(<CategoryPage category='fullhd'/>);

        expect(func).toBeCalledTimes(1);
    });

    it('test sidebar tag clicks', function () {
        const func = jest.fn();

        const wrapper = mount(<CategoryPage category='fullhd'/>);
        wrapper.instance().loadTag = func;

        console.log(wrapper.debug());

        expect(func).toBeCalledTimes(0);
        wrapper.find('SideBar').find('Tag').forEach(e => {
            e.simulate('click');
        });

        expect(func).toBeCalledTimes(4);

    });
});
