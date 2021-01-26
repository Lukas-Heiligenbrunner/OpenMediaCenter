import React from 'react';
import {shallow} from 'enzyme';

import Preview, {TagPreview} from './Preview';

describe('<Preview/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Preview movie_id={1}/>);
        wrapper.unmount();
    });

    it('picture rendered correctly', done => {
        const mockSuccessResponse = 'testsrc';
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({
            text: () => mockJsonPromise
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const wrapper = shallow(<Preview name='test' movie_id={1}/>);

        // now called 1 times
        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            // received picture should be rendered into wrapper
            expect(wrapper.find('.previewimage').props().src).not.toBeNull();
            // check if preview title renders correctly
            expect(wrapper.find('.previewtitle').text()).toBe('test');

            global.fetch.mockClear();
            done();
        });

    });

    it('spinner loads correctly', function () {
        const wrapper = shallow(<Preview movie_id={1}/>);

        // expect load animation to be visible
        expect(wrapper.find('.loadAnimation')).toHaveLength(1);
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
});

