import {shallow} from "enzyme";
import React from "react";
import Player from "./Player";

describe('<Player/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<Player/>);
        wrapper.unmount();
    });

    it('plyr insertion', function () {
        const wrapper = shallow(<Player/>);

        wrapper.setState({
            sources: [
                {
                    src: '/tstvid.mp4',
                    type: 'video/mp4',
                    size: 1080,
                }
            ]
        });
        expect(wrapper.find("r")).toHaveLength(1);
    });

    function simulateLikeButtonClick() {
        const wrapper = shallow(<Player/>);

        // initial fetch for getting movie data
        expect(global.fetch).toHaveBeenCalledTimes(1);
        wrapper.find('.videoactions').find("button").first().simulate('click');
        // fetch for liking
        expect(global.fetch).toHaveBeenCalledTimes(2);

        return wrapper;
    }

    it('likebtn click', done => {
        global.fetch = global.prepareFetchApi({result: 'success'});
        global.console.error = jest.fn();

        simulateLikeButtonClick();


        process.nextTick(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.console.error).toHaveBeenCalledTimes(0);

            global.fetch.mockClear();
            done();
        });
    });

    it('errored likebtn click', done => {
        global.fetch = global.prepareFetchApi({result: 'nosuccess'});
        global.console.error = jest.fn();

        simulateLikeButtonClick();

        process.nextTick(() => {
            // refetch is called so fetch called 3 times
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.console.error).toHaveBeenCalledTimes(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('show tag popup', function () {
        const wrapper = shallow(<Player/>);
        expect(wrapper.find("AddTagPopup")).toHaveLength(0);
        // todo dynamic button find without index
        wrapper.find('.videoactions').find("button").at(1).simulate('click');
        // addtagpopup should be showing now
        expect(wrapper.find("AddTagPopup")).toHaveLength(1);
    });

    it('test delete button', done => {
        const wrapper = shallow(<Player viewbinding={{
            returnToLastElement: jest.fn()
        }}/>);
        global.fetch = prepareFetchApi({result: "success"});

        wrapper.find('.videoactions').find("button").at(2).simulate('click');

        process.nextTick(() => {
            // refetch is called so fetch called 3 times
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(wrapper.instance().props.viewbinding.returnToLastElement).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });

    it('hide click ', function () {
        const wrapper = shallow(<Player/>);
        const func = jest.fn();

        wrapper.setProps({
            viewbinding: {
                returnToLastElement: () => {
                    func()
                }
            }
        });

        expect(func).toHaveBeenCalledTimes(0);
        wrapper.find('.closebutton').simulate('click');
        // addtagpopup should be showing now
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('inserts Tags correctly', function () {
        const wrapper = shallow(<Player/>);

        expect(wrapper.find("Tag")).toHaveLength(0);

        wrapper.setState({
            tags: [
                {tag_name: 'first'},
                {tag_name: 'second'}
            ]
        });

        expect(wrapper.find("Tag")).toHaveLength(2);
    });

    it('inserts tag quickadd correctly', function () {
        generatetag();
    });

    it('test click of quickadd tag btn', done => {
        const wrapper = generatetag();

        global.fetch = prepareFetchApi({result: 'success'});

        // render tag subcomponent
        const tag = wrapper.find("Tag").first().dive();
        tag.simulate('click');

        process.nextTick(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });

    it('test failing quickadd', done => {
        const wrapper = generatetag();

        global.fetch = prepareFetchApi({result: 'nonsuccess'});
        global.console.error = jest.fn();

        // render tag subcomponent
        const tag = wrapper.find("Tag").first().dive();
        tag.simulate('click');

        process.nextTick(() => {
            expect(global.console.error).toHaveBeenCalledTimes(2);

            global.fetch.mockClear();
            done();
        });
    });

    function generatetag() {
        const wrapper = shallow(<Player/>);

        expect(wrapper.find("Tag")).toHaveLength(0);

        wrapper.setState({
            suggesttag: [
                {tag_name: 'first', tag_id: 1},
            ]
        });

        expect(wrapper.find("Tag")).toHaveLength(1);

        return wrapper;
    }
});
