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

    it('test password hide/show switchbutton', function () {
        const wrapper = shallow(<GeneralSettings/>);

        expect(wrapper.find("FormGroup").findWhere(it => it.props().controlId === "passwordfield")).toHaveLength(0);
        wrapper.find("FormCheck").findWhere(it => it.props().label === "Enable Password support").simulate("change");

        expect(wrapper.find("FormGroup").findWhere(it => it.props().controlId === "passwordfield")).toHaveLength(1);
    });

    it('test savesettings', done => {
        const wrapper = shallow(<GeneralSettings/>);

        global.fetch = prepareFetchApi({success: true});

        expect(global.fetch).toBeCalledTimes(0);
        wrapper.find("[data-testid='mainformsettings']").simulate("submit");
        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            // expect callback to have loaded correct tag
            expect(wrapper.state().selected).toBe("testname");

            global.fetch.mockClear();
            done();
        });
    });
});
