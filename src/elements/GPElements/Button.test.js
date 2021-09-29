import {shallow} from 'enzyme';
import React from 'react';
import {Button, IconButton} from './Button';

describe('<Button/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Button onClick={() => {}} title='test'/>);
        wrapper.unmount();
    });

    it('renders title', function () {
        const wrapper = shallow(<Button onClick={() => {}} title='test1'/>);
        expect(wrapper.text()).toBe('test1');
    });

    it('test onclick handling', () => {
        const func = jest.fn();
        const wrapper = shallow(<Button onClick={func} title='test1'/>);

        wrapper.find('button').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });
});

describe('<IconButton/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<IconButton onClick={() => {}} title='test'/>);
        wrapper.unmount();
    });

    it('renders title', function () {
        const wrapper = shallow(<IconButton onClick={() => {}} title='test1'/>);
        expect(wrapper.text()).toBe('<FontAwesomeIcon />test1');
    });

    it('test onclick handling', () => {
        const func = jest.fn();
        const wrapper = shallow(<IconButton onClick={func} title='test1'/>);

        wrapper.find('button').simulate('click');

        expect(func).toHaveBeenCalledTimes(1);
    });
});
