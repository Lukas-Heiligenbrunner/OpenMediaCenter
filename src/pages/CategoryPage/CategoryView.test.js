import {shallow} from 'enzyme';
import React from 'react';
import {CategoryView} from './CategoryView';

describe('<CategoryView/>', function () {
    function instance() {
        return shallow(<CategoryView match={{params: {id: 10}}}/>);
    }

    it('renders without crashing ', function () {
        const wrapper = instance();
        wrapper.unmount();
    });

    it('test backbutton', function () {
        const wrapper = instance();
        const func = jest.fn();
        wrapper.setProps({history: {push: func}});

        expect(func).toHaveBeenCalledTimes(0);
        wrapper.find('button').simulate('click');
        expect(func).toHaveBeenCalledTimes(1);
    });
});
