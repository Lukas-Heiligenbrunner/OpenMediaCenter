import {shallow} from 'enzyme';
import React from 'react';
import ActorTile from './ActorTile';

describe('<ActorTile/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorTile actor={{Thumbnail: '-1', Name: 'testname', id: 3}}/>);
        wrapper.unmount();
    });

    it('simulate click with custom handler', function () {
        const func = jest.fn((_) => {});
        const wrapper = shallow(<ActorTile actor={{Thumbnail: '-1', Name: 'testname', id: 3}} onClick={() => func()}/>);

        wrapper.simulate('click');

        expect(func).toBeCalledTimes(1);
    });
});
