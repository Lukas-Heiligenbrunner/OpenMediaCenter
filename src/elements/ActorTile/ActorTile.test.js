import {shallow} from 'enzyme';
import React from 'react';
import ActorTile from './ActorTile';

describe('<ActorTile/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorTile actor={{thumbnail: "-1", name: "testname", id: 3}}/>);
        wrapper.unmount();
    });

    it('simulate click', function () {
        const wrapper = shallow(<ActorTile actor={{thumbnail: "-1", name: "testname", id: 3}}/>);

        const func = jest.fn();
        prepareViewBinding(func);

        wrapper.simulate('click');

        expect(func).toBeCalledTimes(1);
    });

    it('simulate click with custom handler', function () {
        const func = jest.fn((_) => {});
        const wrapper = shallow(<ActorTile actor={{thumbnail: "-1", name: "testname", id: 3}} onClick={() => func()}/>);

        const func1 = jest.fn();
        prepareViewBinding(func1);

        wrapper.simulate('click');

        expect(func1).toBeCalledTimes(0);
        expect(func).toBeCalledTimes(1);
    });
});
