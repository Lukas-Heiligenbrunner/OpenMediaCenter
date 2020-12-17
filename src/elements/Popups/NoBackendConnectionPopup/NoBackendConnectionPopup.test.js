import {shallow} from 'enzyme';
import React from 'react';
import {NoBackendConnectionPopup} from './NoBackendConnectionPopup';
import {getBackendDomain} from '../../../utils/Api';

describe('<NoBackendConnectionPopup/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<NoBackendConnectionPopup onHide={() => {}}/>);
        wrapper.unmount();
    });

    it('hides on refresh click', function () {
        const func = jest.fn();
        const wrapper = shallow(<NoBackendConnectionPopup onHide={func}/>);

        expect(func).toBeCalledTimes(0);
        wrapper.find('button').simulate('click');

        expect(func).toBeCalledTimes(1);
    });

    it('simulate change of textfield', function () {
        const wrapper = shallow(<NoBackendConnectionPopup onHide={() => {}}/>);

        wrapper.find('input').simulate('change', {target: {value: 'testvalue'}});

        expect(getBackendDomain()).toBe('testvalue');
    });
});
