import React from 'react';

import {shallow} from 'enzyme';
import '@testing-library/jest-dom';
import NewActorPopup, {NewActorPopupContent} from './NewActorPopup';

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
        const wrapper = shallow(<NewActorPopupContent/>);

        // manually set typed in actorname
        wrapper.instance().value = 'testactorname';

        global.fetch = prepareFetchApi({});

        expect(global.fetch).toBeCalledTimes(0);
        wrapper.find('button').simulate('click');

        // fetch should have been called once now
        expect(global.fetch).toBeCalledTimes(1);
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

        expect(wrapper.instance().value).toBe('testinput');
    });
});
