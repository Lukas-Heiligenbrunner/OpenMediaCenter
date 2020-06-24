import {shallow} from "enzyme";
import React from "react";
import Player from "./Player";

function prepareFetchApi(response) {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
}

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

    it('likebtn click', done => {
        global.fetch = prepareFetchApi({result: 'success'});

        const func = jest.fn();

        const wrapper = shallow(<Player/>);
        wrapper.setProps({
            onHide: () => {
                func()
            }
        });

        // initial fetch for getting movie data
        expect(global.fetch).toHaveBeenCalledTimes(1);
        wrapper.find('.videoactions').find("button").first().simulate('click');
        // fetch for liking
        expect(global.fetch).toHaveBeenCalledTimes(2);

        process.nextTick(() => {
            // refetch is called so fetch called 3 times
            expect(global.fetch).toHaveBeenCalledTimes(3);

            global.fetch.mockClear();
            done();
        });
    });

    it('errored likebtn click', done => {
        global.fetch = prepareFetchApi({result: 'nosuccess'});
        const func = jest.fn();

        const wrapper = shallow(<Player/>);
        wrapper.setProps({
            onHide: () => {
                func()
            }
        });

        // initial fetch for getting movie data
        expect(global.fetch).toHaveBeenCalledTimes(1);
        wrapper.find('.videoactions').find("button").first().simulate('click');
        // fetch for liking
        expect(global.fetch).toHaveBeenCalledTimes(2);

        process.nextTick(() => {
            // refetch is called so fetch called 3 times
            expect(global.fetch).toHaveBeenCalledTimes(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('show tag popup', function () {
        const wrapper = shallow(<Player/>);

        expect(wrapper.find("AddTagPopup")).toHaveLength(0);
        wrapper.find('.videoactions').find("button").last().simulate('click');
        // addtagpopup should be showing now
        expect(wrapper.find("AddTagPopup")).toHaveLength(1);
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
});
