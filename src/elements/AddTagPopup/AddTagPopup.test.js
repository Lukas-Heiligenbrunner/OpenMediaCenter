import React from "react";

import {shallow} from 'enzyme'
import "@testing-library/jest-dom"

import AddTagPopup from "./AddTagPopup";

describe('<AddTagPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.unmount();
    });

    it('test dropdown insertion', function () {
        const wrapper = shallow(<AddTagPopup/>);
        wrapper.setState({items: ["test1", "test2", "test3"]});
        expect(wrapper.find('DropdownItem')).toHaveLength(3);
    });

    it('test storeseletion click event', done => {
        const mockSuccessResponse = {};
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const func = jest.fn();

        const wrapper = shallow(<AddTagPopup/>);
        wrapper.setProps({
            onHide: () => {
                func()
            }
        });

        wrapper.setState({
            items: ["test1", "test2", "test3"],
            selection: {
                name: "test1",
                id: 42
            }
        });

        // first call of fetch is getting of available tags
        expect(global.fetch).toHaveBeenCalledTimes(1);
        wrapper.find('ModalFooter').find('button').simulate('click');

        // now called 2 times
        expect(global.fetch).toHaveBeenCalledTimes(2);

        process.nextTick(() => {
            //callback to close window should have called
            expect(func).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });
});
