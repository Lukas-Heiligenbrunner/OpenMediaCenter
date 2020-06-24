import React from "react";
import Tag from './Tag'

import "@testing-library/jest-dom"
import {shallow} from 'enzyme'

describe('<Tag/>', function () {
    function prepareFetchApi(response) {
        const mockJsonPromise = Promise.resolve(response);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        return (jest.fn().mockImplementation(() => mockFetchPromise));
    }

    it('renders without crashing ', function () {
        const wrapper = shallow(<Tag>test</Tag>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<Tag>test</Tag>);
        expect(wrapper.children().text()).toBe("test");
    });

    it('click event triggered and setvideo callback called', function () {
        global.fetch = prepareFetchApi({});
        const func = jest.fn();
        const elem = {
            changeRootElement: () => func()
        };

        const wrapper = shallow(<Tag
            viewbinding={elem}>test</Tag>);

        expect(func).toBeCalledTimes(0);

        wrapper.simulate("click");

        expect(func).toBeCalledTimes(1);
    });
});
