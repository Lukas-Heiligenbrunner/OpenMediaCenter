import {shallow} from 'enzyme';
import React from 'react';
import FilterButton from './FilterButton';
import RandomPage from "../../pages/RandomPage/RandomPage";
import {callAPI} from "../../utils/Api";

describe('<FilterButton/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<FilterButton onFilterChange={() => {}}/>);
        wrapper.unmount();
    });

    it('test initial render ', function () {
        const wrapper = shallow(<FilterButton onFilterChange={() => {}}/>);
        expect(wrapper.find('input')).toHaveLength(0);
    });

    it('test clicking', function () {
        const wrapper = shallow(<FilterButton onFilterChange={() => {}}/>);
        wrapper.simulate('click');

        expect(wrapper.find('input')).toHaveLength(1);
    });

    it('test call of callback on textfield change', function () {
        let val = '';
        const func = jest.fn((vali => {val = vali}));

        const wrapper = shallow(<FilterButton onFilterChange={func}/>);
        wrapper.simulate('click');

        wrapper.find('input').simulate('change', {target: {value: 'test'}});

        expect(func).toHaveBeenCalledTimes(1);
        expect(val).toBe('test')
    });

    it('test closing on x button click', function () {
        const wrapper = shallow(<FilterButton onFilterChange={() => {}}/>);
        wrapper.simulate('click');

        expect(wrapper.find('input')).toHaveLength(1);

        wrapper.find('Button').simulate('click');

        expect(wrapper.find('input')).toHaveLength(0);
    });

    it('test shortkey press', function () {
        let events = [];
        document.addEventListener = jest.fn((event, cb) => {
            events[event] = cb;
        });

        shallow(<RandomPage/>);

        const wrapper = shallow(<FilterButton onFilterChange={() => {}}/>);
        expect(wrapper.find('input')).toHaveLength(0);
        // trigger the keypress event
        events.keyup({key: 'f'});

        expect(wrapper.find('input')).toHaveLength(1);
    });
});
