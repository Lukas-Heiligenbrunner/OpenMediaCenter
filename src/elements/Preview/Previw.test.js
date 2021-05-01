import React from 'react';
import {shallow} from 'enzyme';

import Preview, {TagPreview} from './Preview';

describe('<Preview/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Preview movieId={1} name='test' picLoader={callback => callback('')}/>);
        wrapper.unmount();
    });

    it('picture rendered correctly', () => {
        const func = jest.fn();
        const wrapper = shallow(<Preview movieId={1} name='test' picLoader={callback => {
            func();
            callback('42');
        }}/>);

        // expect picloader tobe called once
        expect(func).toHaveBeenCalledTimes(1)

        // received picture should be rendered into wrapper
        expect(wrapper.find('.previewimage').props().src).toBe('42');
        // check if preview title renders correctly
        expect(wrapper.find('.previewtitle').text()).toBe('test');
    });

    it('spinner loads correctly', function () {
        // if callback is never called --> infinite spinner
        const wrapper = shallow(<Preview movieId={1} name='test' picLoader={callback => {}}/>);

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

