import {shallow} from "enzyme";
import React from "react";
import MovieSettings from "./MovieSettings";

describe('<MovieSettings/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<MovieSettings/>);
        wrapper.unmount();
    });

    it('received text renders into dom', function () {
        const wrapper = shallow(<MovieSettings/>);

        wrapper.setState({
            text: [
                "firstline",
                "secline"
            ]
        });

        expect(wrapper.find(".indextextarea").find(".textarea-element")).toHaveLength(2);
    });

    it('test simulate reindex', function () {
        global.fetch = global.prepareFetchApi({success: true});
        const wrapper = shallow(<MovieSettings/>);

        wrapper.find("button").findWhere(e => e.text() === "Reindex Movie" && e.type() === "button").simulate("click");

        // initial send of reindex request to server
        expect(global.fetch).toBeCalledTimes(1);
    });

    it('test failing reindex start', done => {
        global.fetch = global.prepareFetchApi({success: false});
        const wrapper = shallow(<MovieSettings/>);

        wrapper.find("button").findWhere(e => e.text() === "Reindex Movie" && e.type() === "button").simulate("click");

        // initial send of reindex request to server
        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            // reindex already running --> so disable startbdn
            expect(wrapper.state()).toMatchObject({startbtnDisabled: true});

            global.fetch.mockClear();
            done();
        });
    });

    it('content available received and in state', done => {
        global.fetch = global.prepareFetchApi({
            contentAvailable: true,
            message: "firstline\nsecondline"
        });
        const wrapper = shallow(<MovieSettings/>);
        wrapper.instance().updateStatus();

        process.nextTick(() => {
            expect(wrapper.state()).toMatchObject({
                text: [
                    "firstline",
                    "secondline"
                ]
            });

            global.fetch.mockClear();
            done();
        });
    });

    it('test reindex with no content available', done=> {
        global.fetch = global.prepareFetchApi({
            contentAvailable: false
        });

        global.clearInterval = jest.fn();

        const wrapper = shallow(<MovieSettings/>);
        wrapper.instance().updateStatus();

        process.nextTick(() => {
            // expect the refresh interval to be cleared
            expect(global.clearInterval).toBeCalledTimes(1);

            // expect startbtn to be reenabled
            expect(wrapper.state()).toMatchObject({startbtnDisabled: false});

            global.fetch.mockClear();
            done();
        });
    });

    it('test simulate gravity cleanup', done => {
        global.fetch = global.prepareFetchApi("mmi");
        const wrapper = shallow(<MovieSettings/>);
        wrapper.instance().setState = jest.fn(),

        wrapper.find("button").findWhere(e => e.text() === "Cleanup Gravity" && e.type() === "button").simulate("click");

        // initial send of reindex request to server
        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            expect(wrapper.instance().setState).toBeCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });
});
