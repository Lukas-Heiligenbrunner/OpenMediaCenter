import {shallow, mount} from "enzyme";
import React from "react";
import CategoryPage from "./CategoryPage";
import VideoContainer from "../../elements/VideoContainer/VideoContainer";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

describe('<CategoryPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<CategoryPage/>);
        wrapper.unmount();
    });

    it('test tag fetch call', done => {
        global.fetch = prepareFetchApi(["first", "second"]);

        const wrapper = shallow(<CategoryPage/>);

        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(wrapper.state().loadedtags.length).toBe(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('test errored fetch call', done => {
        global.fetch = prepareFetchApi({});

        let message;
        global.console.log = jest.fn((m) => {
            message = m;
        });

        const wrapper = shallow(<CategoryPage/>);

        expect(global.fetch).toHaveBeenCalledTimes(1);

        process.nextTick(() => {
            //callback to close window should have called
            expect(message).toBe("no connection to backend");

            global.fetch.mockClear();
            done();
        });
    });

    it('test new tag popup', function () {
        const wrapper = mount(<CategoryPage/>);

        expect(wrapper.find("NewTagPopup")).toHaveLength(0);
        wrapper.find('[data-testid="btnaddtag"]').simulate('click');
        // newtagpopup should be showing now
        expect(wrapper.find("NewTagPopup")).toHaveLength(1);

        // click close button in modal
        wrapper.find(".modal-header").find("button").simulate("click");
        expect(wrapper.find("NewTagPopup")).toHaveLength(0);
    });

    it('test setpage callback', done => {
        global.fetch = prepareFetchApi([{}, {}]);

        const wrapper = mount(<CategoryPage/>);

        wrapper.setState({
            loadedtags: [
                {
                    tag_name: "testname",
                    tag_id: 42
                }
            ]
        });

        wrapper.find("TagPreview").find("div").first().simulate("click");

        process.nextTick(() => {
            // expect callback to have loaded correct tag
            expect(wrapper.state().selected).toBe("testname");
            // expect to receive a videocontainer with simulated data
            expect(wrapper.instance().selectionelements).toMatchObject(<VideoContainer data={[{}, {}]}/>);

            global.fetch.mockClear();
            done();
        });
    });

    it('test back to category view callback', function () {
        const wrapper = shallow(<CategoryPage/>);

        wrapper.setState({
            selected: "test"
        });
        expect(wrapper.state().selected).not.toBeNull();
        wrapper.find('[data-testid="backbtn"]').simulate("click");
        expect(wrapper.state().selected).toBeNull();
    });
});
