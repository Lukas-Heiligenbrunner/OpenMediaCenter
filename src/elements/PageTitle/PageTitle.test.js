import React from 'react';
import {shallow} from 'enzyme'

import PageTitle from "./PageTitle";

describe('<Preview/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<PageTitle/>);
        wrapper.unmount();
    });

    it('renders childs correctly', function () {
        const wrapper = shallow(<PageTitle>heyimachild</PageTitle>);

        const children = wrapper.children();
        expect(children.at(children.length-2).text()).toBe("heyimachild");
    });

    it('renders pagetitle prop', function () {
        const wrapper = shallow(<PageTitle title='testtitle'/>);

        expect(wrapper.find(".pageheader").text()).toBe("testtitle");
    });

    it('renders subtitle prop', function () {
        const wrapper = shallow(<PageTitle subtitle='testsubtitle'/>);

        expect(wrapper.find(".pageheadersubtitle").text()).toBe("testsubtitle");
    });
});

