import React from 'react';
import App from './App';
import {shallow} from 'enzyme';
import GlobalInfos from "./utils/GlobalInfos";

describe('<App/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<App/>);
        wrapper.unmount();
    });

    it('renders title', () => {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('.navbrand').text()).toBe('OpenMediaCenter');
    });

    it('are navlinks correct', function () {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('.navitem')).toHaveLength(4);
    });

    it('test initial fetch from api', done => {
        callAPIMock({
            MediacenterName: 'testname'
        })

        GlobalInfos.enableDarkTheme = jest.fn((r) => {})

        const wrapper = shallow(<App/>);

        process.nextTick(() => {
            expect(document.title).toBe('testname');

            global.fetch.mockClear();
            done();
        });
    });
});
