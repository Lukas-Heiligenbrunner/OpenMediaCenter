import React from 'react';
import App from './App';
import {shallow} from 'enzyme';

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
        global.fetch = global.prepareFetchApi({
            generalSettingsLoaded: true,
            passwordsupport: true,
            mediacentername: 'testname'
        });

        const wrapper = shallow(<App/>);


        const func = jest.fn();
        wrapper.instance().setState = func;

        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            expect(func).toBeCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });
});
