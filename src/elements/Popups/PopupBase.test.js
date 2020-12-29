import {shallow} from 'enzyme';
import React from 'react';
import PopupBase from './PopupBase';

describe('<PopupBase/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<PopupBase/>);
        wrapper.unmount();
    });

    it('simulate keypress', function () {
        let events = [];
        document.addEventListener = jest.fn((event, cb) => {
            events[event] = cb;
        });

        const func = jest.fn();
        shallow(<PopupBase onHide={() => func()}/>);

        // trigger the keypress event
        events.keyup({key: 'Escape'});

        expect(func).toBeCalledTimes(1);
    });

});
