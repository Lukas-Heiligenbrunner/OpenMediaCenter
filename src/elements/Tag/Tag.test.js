import React from 'react';
import Tag from './Tag';

import '@testing-library/jest-dom';
import {shallow} from 'enzyme';

describe('<Tag/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Tag>test</Tag>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<Tag>test</Tag>);
        expect(wrapper.children().text()).toBe('test');
    });

    it('click event triggered and setvideo callback called', function () {
        global.fetch = prepareFetchApi({});
        const func = jest.fn();
        prepareViewBinding(func);

        const wrapper = shallow(<Tag>test</Tag>);

        expect(func).toBeCalledTimes(0);

        wrapper.simulate('click');

        expect(func).toBeCalledTimes(1);
    });

    it('test custom onclick function', function () {
        const func = jest.fn();

        const wrapper = shallow(<Tag
            onclick={() => {func();}}>test</Tag>);

        expect(func).toBeCalledTimes(0);

        wrapper.simulate('click');

        expect(func).toBeCalledTimes(1);
    });
});
