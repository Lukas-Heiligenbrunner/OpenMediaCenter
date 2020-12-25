import {shallow} from 'enzyme';
import React from 'react';
import {Button} from './Button';

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

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
