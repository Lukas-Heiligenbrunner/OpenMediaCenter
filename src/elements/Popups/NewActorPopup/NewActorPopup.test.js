import React from 'react';

import {shallow} from 'enzyme';
import '@testing-library/jest-dom';
import NewActorPopup, {NewActorPopupContent} from './NewActorPopup';
import {callAPI} from '../../../utils/Api';

describe('<NewActorPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<NewActorPopup/>);
        wrapper.unmount();
    });
});

describe('<NewActorPopupContent/>', () => {
    it('renders without crashing', function () {
        const wrapper = shallow(<NewActorPopupContent/>);
        wrapper.unmount();
    });

    it('simulate button click', function () {
        global.callAPIMock({});

        const func = jest.fn();
        const wrapper = shallow(<NewActorPopupContent onHide={() => {func();}}/>);

        // manually set typed in actorname
        wrapper.instance().nameValue = 'testactorname';

        global.fetch = prepareFetchApi({});

        expect(callAPI).toBeCalledTimes(0);
        wrapper.find('button').simulate('click');

        // fetch should have been called once now
        expect(callAPI).toBeCalledTimes(1);

        expect(func).toHaveBeenCalledTimes(1);
    });

    it('test not allowing request if textfield is empty', function () {
        const wrapper = shallow(<NewActorPopupContent/>);

        global.fetch = prepareFetchApi({});

        expect(global.fetch).toBeCalledTimes(0);
        wrapper.find('button').simulate('click');

        // fetch should not be called now
        expect(global.fetch).toBeCalledTimes(0);
    });

    it('test input change', function () {
        const wrapper = shallow(<NewActorPopupContent/>);

        wrapper.find('input').simulate('change', {target: {value: 'testinput'}});

        expect(wrapper.instance().nameValue).toBe('testinput');
    });
});
