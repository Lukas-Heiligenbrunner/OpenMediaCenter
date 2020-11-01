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

    it('are default navlinks correct', function () {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('.navitem')).toHaveLength(5);
    });

    it('simulate video view change ', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({generalSettingsLoaded: true}); // simulate fetch to have already finisheed

        wrapper.instance().changeRootElement(<div id='testit'/>);

        expect(wrapper.find('#testit')).toHaveLength(1);
    });

    it('test hide video again', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({generalSettingsLoaded: true}); // simulate fetch to have already finisheed

        wrapper.instance().changeRootElement(<div id='testit'/>);

        expect(wrapper.find('#testit')).toHaveLength(1);

        wrapper.instance().returnToLastElement();

        expect(wrapper.find('HomePage')).toHaveLength(1);
    });

    it('test fallback to last loaded page', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({generalSettingsLoaded: true}); // simulate fetch to have already finisheed

        wrapper.find('.navitem').findWhere(t => t.text() === 'Random Video' && t.type() === 'div').simulate('click');

        wrapper.instance().changeRootElement(<div id='testit'/>);

        expect(wrapper.find('#testit')).toHaveLength(1);

        wrapper.instance().returnToLastElement();

        expect(wrapper.find('RandomPage')).toHaveLength(1);
    });

    it('test home click', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({generalSettingsLoaded: true}); // simulate fetch to have already finisheed

        wrapper.setState({page: 'wrongvalue'});
        expect(wrapper.find('HomePage')).toHaveLength(0);
        wrapper.find('.navitem').findWhere(t => t.text() === 'Video' && t.type() === 'div').simulate('click');
        expect(wrapper.find('HomePage')).toHaveLength(1);
    });

    it('test category click', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({generalSettingsLoaded: true}); // simulate fetch to have already finisheed

        expect(wrapper.find('CategoryPage')).toHaveLength(0);
        wrapper.find('.navitem').findWhere(t => t.text() === 'Categories' && t.type() === 'div').simulate('click');
        expect(wrapper.find('CategoryPage')).toHaveLength(1);
    });

    it('test settings click', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({generalSettingsLoaded: true}); // simulate fetch to have already finisheed

        expect(wrapper.find('SettingsPage')).toHaveLength(0);
        wrapper.find('.navitem').findWhere(t => t.text() === 'Settings' && t.type() === 'div').simulate('click');
        expect(wrapper.find('SettingsPage')).toHaveLength(1);
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
