import {shallow} from 'enzyme';
import React from 'react';
import CategoryPage from './CategoryPage';

describe('<CategoryPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<CategoryPage/>);
        wrapper.unmount();
    });

    it('test new tag popup', function () {
        const wrapper = shallow(<CategoryPage/>);

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
        wrapper.find('[data-testid="btnaddtag"]').simulate('click');
        // newtagpopup should be showing now
        expect(wrapper.find('NewTagPopup')).toHaveLength(1);
    });

    it('test add popup', function () {
        const wrapper = shallow(<CategoryPage/>);

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
        wrapper.setState({popupvisible: true});
        expect(wrapper.find('NewTagPopup')).toHaveLength(1);
    });

    it('test hiding of popup', function () {
        const wrapper = shallow(<CategoryPage/>);
        wrapper.setState({popupvisible: true});

        wrapper.find('NewTagPopup').props().onHide();

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
    });

    it('test setting of subtitle', function () {
        const wrapper = shallow(<CategoryPage/>);

        expect(wrapper.find('PageTitle').props().subtitle).not.toBe('testtitle');

        wrapper.instance().setSubTitle('testtitle');

        // test if prop of title is set correctly
        expect(wrapper.find('PageTitle').props().subtitle).toBe('testtitle');
    });
});
