import React from 'react';
import App from './App';
import {shallow} from 'enzyme'

describe('<App/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<App/>);
        wrapper.unmount();
    });

    it('renders title', () => {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('.navbar-brand').text()).toBe('OpenMediaCenter');
    });

    it('are navlinks correct', function () {
        const wrapper = shallow(<App/>);
        expect(wrapper.find('nav').find('li')).toHaveLength(4);
    });

    it('simulate video view change ', function () {
        const wrapper = shallow(<App/>);

        wrapper.instance().showVideo(<div id='testit'></div>);

        expect(wrapper.find("#testit")).toHaveLength(1);
    });

    it('test hide video again', function () {
        const wrapper = shallow(<App/>);

        wrapper.instance().showVideo(<div id='testit'></div>);

        expect(wrapper.find("#testit")).toHaveLength(1);

        wrapper.instance().hideVideo();

        expect(wrapper.find("HomePage")).toHaveLength(1);
    });

    it('test fallback to last loaded page', function () {
        const wrapper = shallow(<App/>);

        wrapper.find(".nav-link").findWhere(t => t.text() === "Random Video" && t.type() === "div").simulate("click");

        wrapper.instance().showVideo(<div id='testit'></div>);

        expect(wrapper.find("#testit")).toHaveLength(1);

        wrapper.instance().hideVideo();

        expect(wrapper.find("RandomPage")).toHaveLength(1);
    });

    it('test home click', function () {
        const wrapper = shallow(<App/>);
        wrapper.setState({page: "wrongvalue"});
        expect(wrapper.find("HomePage")).toHaveLength(0);
        wrapper.find(".nav-link").findWhere(t => t.text() === "Home" && t.type() === "div").simulate("click");
        expect(wrapper.find("HomePage")).toHaveLength(1);
    });

    it('test category click', function () {
        const wrapper = shallow(<App/>);

        expect(wrapper.find("CategoryPage")).toHaveLength(0);
        wrapper.find(".nav-link").findWhere(t => t.text() === "Categories" && t.type() === "div").simulate("click");
        expect(wrapper.find("CategoryPage")).toHaveLength(1);
    });

    it('test settings click', function () {
        const wrapper = shallow(<App/>);

        expect(wrapper.find("SettingsPage")).toHaveLength(0);
        wrapper.find(".nav-link").findWhere(t => t.text() === "Settings" && t.type() === "div").simulate("click");
        expect(wrapper.find("SettingsPage")).toHaveLength(1);
    });
});
