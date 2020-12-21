import {shallow} from 'enzyme';
import React from 'react';
import ActorPage from './ActorPage';

describe('<ActorPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorPage actor={{actor_id: 5, name: 'usr1'}}/>);
        wrapper.unmount();
    });


});
