import React from 'react';

import {shallow} from 'enzyme';
import '@testing-library/jest-dom';
import NewTagPopup from './NewTagPopup';

describe('<NewTagPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<NewTagPopup/>);
        wrapper.unmount();
    });

    it('test storeseletion click event', done => {
        const mockSuccessResponse = {};
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const func = jest.fn();

        const wrapper = shallow(<NewTagPopup/>);
        wrapper.setProps({
            onHide: () => {
                func();
            }
        });

        wrapper.find('ModalFooter').find('button').simulate('click');
        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(func).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });
});
