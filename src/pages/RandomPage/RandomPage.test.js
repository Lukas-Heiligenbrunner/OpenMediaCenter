import {shallow} from "enzyme";
import React from "react";
import RandomPage from "./RandomPage";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

describe('<RandomPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<RandomPage/>);
        wrapper.unmount();
    });

    it('test shuffleload fetch', function () {
        global.fetch = prepareFetchApi({});

        const wrapper = shallow(<RandomPage/>);

        expect(global.fetch).toBeCalledTimes(1);
    });

    it('btnshuffle click test', function () {
        global.fetch = prepareFetchApi({});

        const wrapper = shallow(<RandomPage/>);

        wrapper.find(".btnshuffle").simulate("click");

        expect(global.fetch).toBeCalledTimes(2);
    });

    it('test tags in random selection', function () {
        const wrapper = shallow(<RandomPage/>);

        wrapper.setState({
            tags: [
                {tag_name: "test1"},
                {tag_name: "test2"}
            ]
        });

        expect(wrapper.find("Tag")).toHaveLength(2);
    });
});
