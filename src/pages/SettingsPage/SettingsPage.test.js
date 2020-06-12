import {shallow} from "enzyme";
import React from "react";
import SettingsPage from "./SettingsPage";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

describe('<RandomPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<SettingsPage/>);
        wrapper.unmount();
    });

    it('received text renders into dom', function () {
        const wrapper = shallow(<SettingsPage/>);

        wrapper.setState({
            text: [
                "firstline",
                "secline"
            ]
        });

        expect(wrapper.find(".indextextarea").find(".textarea-element")).toHaveLength(2);
    });

    it('test simulate reindex', function () {
        global.fetch = prepareFetchApi({});
        const wrapper = shallow(<SettingsPage/>);

        wrapper.find(".reindexbtn").simulate("click");

        // initial send of reindex request to server
        expect(global.fetch).toBeCalledTimes(1);
    });
});
