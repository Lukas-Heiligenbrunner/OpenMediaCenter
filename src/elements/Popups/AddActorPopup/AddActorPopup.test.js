import {shallow} from 'enzyme';
import React from 'react';
import AddActorPopup from './AddActorPopup';
import {callAPI} from 'gowebsecure';

describe('<AddActorPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AddActorPopup/>);
        wrapper.unmount();
    });

    it('simulate change to other page', function () {
        const wrapper = shallow(<AddActorPopup/>);

        expect(wrapper.find('NewActorPopupContent')).toHaveLength(0);
        wrapper.find('PopupBase').props().banner.props.onClick();

        // check if new content is showing
        expect(wrapper.find('NewActorPopupContent')).toHaveLength(1);
    });

    it('hide new actor page', function () {
        const wrapper = shallow(<AddActorPopup/>);
        wrapper.find('PopupBase').props().banner.props.onClick();

        // call onhide event listener manually
        wrapper.find('NewActorPopupContent').props().onHide();

        // expect other page to be hidden again
        expect(wrapper.find('NewActorPopupContent')).toHaveLength(0);
    });

    it('test api call and insertion of actor tiles', function () {
        global.callAPIMock([{Id: 1, Name: 'test'}, {Id: 2, Name: 'test2'}]);

        const wrapper = shallow(<AddActorPopup/>);

        expect(wrapper.find('ActorTile')).toHaveLength(2);
    });

    it('simulate actortile click', function () {
        const func = jest.fn();
        const wrapper = shallow(<AddActorPopup onHide={() => {func();}} movieId={1}/>);

        global.callAPIMock({result: 'success'});

        wrapper.setState({actors: [{ActorId: 1, Name: 'test'}]}, () => {
            wrapper.find('ActorTile').dive().simulate('click');

            expect(callAPI).toHaveBeenCalledTimes(1);

            expect(func).toHaveBeenCalledTimes(1);
        });
    });

    it('test failing actortile click', function () {
        const func = jest.fn();
        const wrapper = shallow(<AddActorPopup onHide={() => {func();}}/>);

        global.callAPIMock({result: 'nosuccess'});

        wrapper.setState({actors: [{ActorId: 1, Name: 'test'}]}, () => {
            wrapper.find('ActorTile').dive().simulate('click');

            expect(callAPI).toHaveBeenCalledTimes(1);

            // hide funtion should not have been called on error!
            expect(func).toHaveBeenCalledTimes(0);
        });
    });

    it('test no actor on loading', function () {
        const wrapper = shallow(<AddActorPopup/>);

        expect(wrapper.find('PopupBase').find('ActorTile')).toHaveLength(0);
    });

    it('test Enter submit if only one element left', function () {
        const wrapper = shallow(<AddActorPopup/>);

        callAPIMock({});

        wrapper.setState({actors: [{Name: 'test', ActorId: 1}]});

        wrapper.find('PopupBase').props().ParentSubmit();

        expect(callAPI).toHaveBeenCalledTimes(1);
    });
});
