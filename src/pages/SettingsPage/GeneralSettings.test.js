import {shallow} from "enzyme";
import React from "react";
import GeneralSettings from "./GeneralSettings";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

describe('<GeneralSettings/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<GeneralSettings/>);
        wrapper.unmount();
    });

    
});
