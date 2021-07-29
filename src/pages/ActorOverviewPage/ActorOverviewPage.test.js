import {shallow} from 'enzyme';
import React from 'react';
import ActorOverviewPage from './ActorOverviewPage';

describe('<ActorOverviewPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorOverviewPage/>);
        wrapper.unmount();
    });

    it('test newtagpopup visibility', function () {
        const wrapper = shallow(<ActorOverviewPage/>);

        expect(wrapper.find('NewActorPopup')).toHaveLength(0);

        wrapper.find('SideBar').find('Button').simulate('click');

        expect(wrapper.find('NewActorPopup')).toHaveLength(1);
    });

    it('test popup hiding', function () {
        const wrapper = shallow(<ActorOverviewPage/>);
        wrapper.setState({NActorPopupVisible: true});

        wrapper.find('NewActorPopup').props().onHide();

        expect(wrapper.find('NewActorPopup')).toHaveLength(0);
    });
});
