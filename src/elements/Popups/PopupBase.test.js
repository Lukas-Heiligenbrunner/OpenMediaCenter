import {shallow} from 'enzyme';
import React from 'react';
import PopupBase from './PopupBase';

describe('<PopupBase/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<PopupBase/>);
        wrapper.unmount();
    });

    it('simulate keypress', function () {
        mockKeyPress();
        const func = jest.fn();
        const events = mockKeyPress();

        shallow(<PopupBase onHide={() => func()}/>);

        // trigger the keypress event
        events.keyup({key: 'Escape'});

        expect(func).toBeCalledTimes(1);
    });

    it('test an Enter sumit', function () {
        const events = mockKeyPress();
        const func = jest.fn();
        shallow(<PopupBase ParentSubmit={() => func()}/>);

        // trigger the keypress event
        events.keyup({key: 'Enter'});

        expect(func).toBeCalledTimes(1);
    });
});
