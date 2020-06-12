import {shallow} from "enzyme";
import React from "react";
import HomePage from "./HomePage";
import VideoContainer from "../../elements/VideoContainer/VideoContainer";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

describe('<HomePage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<HomePage/>);
        wrapper.unmount();
    });

    it('ckeck default tag click events', function () {
        const wrapper = shallow(<HomePage/>);
        global.fetch = prepareFetchApi({});

        expect(global.fetch).toBeCalledTimes(0);
        // click every tag button
        wrapper.find("Tag").map((i) => {
            i.simulate("click");
        });
        expect(global.fetch).toBeCalledTimes(4);
    });

    it('test data insertion', function () {
        const wrapper = shallow(<HomePage/>);

        expect(wrapper.find("VideoContainer")).toHaveLength(0);

        wrapper.setState({
            data: [
                {}, {}
            ]
        });

        // there shoud be loaded the Videocontainer element into dom after fetching videos correctly
        expect(wrapper.find("VideoContainer")).toHaveLength(1);
    });

    it('test title and nr insertions', function () {
        const wrapper = shallow(<HomePage/>);

        expect(wrapper.find(".pageheadersubtitle").text()).toBe("All Videos - 0");

        wrapper.setState({
            tag: "testtag",
            selectionnr: 42
        });

        expect(wrapper.find(".pageheadersubtitle").text()).toBe("testtag Videos - 42");
    });

    it('test search field', done => {
        global.fetch = prepareFetchApi([{},{}]);

        const wrapper = shallow(<HomePage/>);

        wrapper.find('[data-testid="searchtextfield"]').simulate('change', { target: { value: 'testvalue' } });
        wrapper.find('[data-testid="searchbtnsubmit"]').simulate("click");

        process.nextTick(() => {
            // state to be set correctly with response
            expect(wrapper.state().selectionnr).toBe(2);

            global.fetch.mockClear();
            done();
        });
    });
});
