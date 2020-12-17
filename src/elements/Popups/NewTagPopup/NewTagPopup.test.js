import React from 'react';

import {shallow} from 'enzyme';
import '@testing-library/jest-dom';
import NewTagPopup from './NewTagPopup';
import {NoBackendConnectionPopup} from '../NoBackendConnectionPopup/NoBackendConnectionPopup';
import {getBackendDomain} from '../../../utils/Api';

describe('<NewTagPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<NewTagPopup/>);
        wrapper.unmount();
    });

    it('test storeseletion click event', done => {
        global.fetch = prepareFetchApi({});

        const func = jest.fn();

        const wrapper = shallow(<NewTagPopup/>);
        wrapper.setProps({
            onHide: () => {
                func();
            }
        });

        wrapper.find('button').simulate('click');
        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(func).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });

    it('simulate textfield change', function () {
        const wrapper = shallow(<NewTagPopup/>);

        wrapper.find('input').simulate('change', {target: {value: 'testvalue'}});

        expect(wrapper.instance().value).toBe('testvalue');
    });
});
