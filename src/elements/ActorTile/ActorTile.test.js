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
});
