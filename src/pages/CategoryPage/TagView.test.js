import {shallow} from 'enzyme';
import React from 'react';
import TagView from './TagView';

describe('<TagView/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<TagView/>);
        wrapper.unmount();
    });

    it('test new tag popup', function () {
        const wrapper = shallow(<TagView/>);

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
        wrapper.find('[data-testid="btnaddtag"]').simulate('click');
        // newtagpopup should be showing now
        expect(wrapper.find('NewTagPopup')).toHaveLength(1);
    });

    it('test add popup', function () {
        const wrapper = shallow(<TagView/>);

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
        wrapper.setState({popupvisible: true});
        expect(wrapper.find('NewTagPopup')).toHaveLength(1);
    });

    it('test hiding of popup', function () {
        const wrapper = shallow(<TagView/>);
        wrapper.setState({popupvisible: true});

        wrapper.find('NewTagPopup').props().onHide();

        expect(wrapper.find('NewTagPopup')).toHaveLength(0);
    });
});
