import React from 'react';
import Tag from './Tag';

import '@testing-library/jest-dom';
import {shallow} from 'enzyme';

describe('<Tag/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Tag tagInfo={{tag_name: 'testname', tag_id: 1}}/>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<Tag tagInfo={{tag_name: 'test', tag_id: 1}}/>);
        expect(wrapper.children().text()).toBe('test');
    });

    it('test custom onclick function', function () {
        const func = jest.fn();

        const wrapper = shallow(<Tag
            tagInfo={{tag_name: 'test', tag_id: 1}}
            onclick={() => {func();}}>test</Tag>);

        expect(func).toBeCalledTimes(0);

        wrapper.simulate('click');

        expect(func).toBeCalledTimes(1);
    });
});
