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

    it('simulate topic clicka', function () {
        const wrapper = shallow(<SettingsPage/>);

        simulateSideBarClick("General",wrapper);
        expect(wrapper.state().currentpage).toBe("general");
        expect(wrapper.find(".SettingsContent").find("GeneralSettings")).toHaveLength(1);

        simulateSideBarClick("Movies",wrapper);
        expect(wrapper.state().currentpage).toBe("movies");
        expect(wrapper.find(".SettingsContent").find("MovieSettings")).toHaveLength(1);

        simulateSideBarClick("TV Shows",wrapper);
        expect(wrapper.state().currentpage).toBe("tv");
        expect(wrapper.find(".SettingsContent").find("a")).toHaveLength(1);
    });

    function simulateSideBarClick(name, wrapper) {
        wrapper.find(".SettingSidebarElement").findWhere(it =>
            it.text() === name &&
            it.type() === "div").simulate("click");
    }

    it('simulate unknown topic', function () {
        const wrapper = shallow(<SettingsPage/>);
        wrapper.setState({currentpage: "unknown"});

        expect(wrapper.find(".SettingsContent").text()).toBe("unknown button clicked");

    });
});
