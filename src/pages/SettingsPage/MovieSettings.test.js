import {shallow} from "enzyme";
import React from "react";
import MovieSettings from "./MovieSettings";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

describe('<MovieSettings/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<MovieSettings/>);
        wrapper.unmount();
    });


});
