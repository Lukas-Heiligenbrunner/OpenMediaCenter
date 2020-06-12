import React from 'react';
import {shallow} from 'enzyme'

import Preview, {TagPreview} from "./Preview";

describe('<Preview/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Preview/>);
        wrapper.unmount();
    });

    // check if preview title renders correctly
    it('renders title', () => {
        const wrapper = shallow(<Preview name='test'/>);
        expect(wrapper.find('.previewtitle').text()).toBe('test');
    });


    it('click event triggered', () => {
        const func = jest.fn();

        const wrapper = shallow(<Preview/>);
        wrapper.setProps({
            viewbinding: {
                showVideo: () => {
                    func()
                }
            }
        });

        wrapper.find('.videopreview').simulate('click');

        //callback to open player should have called
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('picture rendered correctly', done => {
        const mockSuccessResponse = 'testsrc';
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({
            text: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const wrapper = shallow(<Preview/>);

        // now called 1 times
        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            // received picture should be rendered into wrapper
            expect(wrapper.find(".previewimage").props().src).not.toBeNull();

            global.fetch.mockClear();
            done();
        });

    });
});

describe('<TagPreview/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<TagPreview/>);
        wrapper.unmount();
    });

    // check if preview title renders correctly
    it('renders title', () => {
        const wrapper = shallow(<TagPreview name='test'/>);
        expect(wrapper.find('.tagpreviewtitle').text()).toBe('test');
    });


    it('click event triggered', done => {
        const mockSuccessResponse = {};
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const func = jest.fn();

        const wrapper = shallow(<TagPreview/>);
        wrapper.setProps({
            categorybinding: () => {
                func()
            }
        });

        // first call of fetch is getting of available tags
        expect(global.fetch).toHaveBeenCalledTimes(0);
        wrapper.find('.videopreview').simulate('click');

        // now called 1 times
        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(func).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });
});

