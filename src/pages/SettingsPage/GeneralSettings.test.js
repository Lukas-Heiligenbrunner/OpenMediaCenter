import {shallow} from 'enzyme';
import React from 'react';
import GeneralSettings from './GeneralSettings';
import GlobalInfos from '../../utils/GlobalInfos';

describe('<GeneralSettings/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<GeneralSettings/>);
        wrapper.unmount();
    });

    it('test password hide/show switchbutton', function () {
        const wrapper = shallow(<GeneralSettings/>);

        expect(wrapper.find('[data-testid=\'passwordfield\']')).toHaveLength(0);
        wrapper.find('FormCheck').findWhere(it => it.props().label === 'Enable Password support').simulate('change');

        expect(wrapper.find('[data-testid=\'passwordfield\']')).toHaveLength(1);
    });

    it('test theme switchbutton', function () {
        const wrapper = shallow(<GeneralSettings/>);

        GlobalInfos.enableDarkTheme(false);
        expect(GlobalInfos.isDarkTheme()).toBe(false);
        wrapper.find('[data-testid=\'darktheme-switch\']').simulate('change');
        expect(GlobalInfos.isDarkTheme()).toBe(true);
    });

    it('test savesettings', done => {
        const wrapper = shallow(<GeneralSettings/>);

        global.fetch = global.prepareFetchApi({success: true});

        expect(global.fetch).toBeCalledTimes(0);
        const fakeEvent = {preventDefault: () => console.log('preventDefault')};
        wrapper.find('[data-testid=\'mainformsettings\']').simulate('submit', fakeEvent);
        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            // todo 2020-07-13: test popup of error success here

            global.fetch.mockClear();
            done();
        });
    });

    it('test failing savesettings', done => {
        const wrapper = shallow(<GeneralSettings/>);

        global.fetch = global.prepareFetchApi({success: false});

        expect(global.fetch).toBeCalledTimes(0);
        const fakeEvent = {preventDefault: () => console.log('preventDefault')};
        wrapper.find('[data-testid=\'mainformsettings\']').simulate('submit', fakeEvent);
        expect(global.fetch).toBeCalledTimes(1);

        process.nextTick(() => {
            // todo 2020-07-13: test error popup here!

            global.fetch.mockClear();
            done();
        });
    });

    it('test videopath change event', function () {
        const wrapper = shallow(<GeneralSettings/>);

        expect(wrapper.state().videopath).not.toBe('test');

        const event = {target: {name: 'pollName', value: 'test'}};
        wrapper.find('[data-testid=\'videpathform\']').find('FormControl').simulate('change', event);
        expect(wrapper.state().videopath).toBe('test');
    });

    it('test tvshowpath change event', function () {
        const wrapper = shallow(<GeneralSettings/>);

        const event = {target: {name: 'pollName', value: 'test'}};
        expect(wrapper.state().tvshowpath).not.toBe('test');
        wrapper.find('[data-testid=\'tvshowpath\']').find('FormControl').simulate('change', event);
        expect(wrapper.state().tvshowpath).toBe('test');
    });

    it('test mediacentername-form change event', function () {
        const wrapper = shallow(<GeneralSettings/>);

        const event = {target: {name: 'pollName', value: 'test'}};
        expect(wrapper.state().mediacentername).not.toBe('test');
        wrapper.find('[data-testid=\'nameform\']').find('FormControl').simulate('change', event);
        expect(wrapper.state().mediacentername).toBe('test');
    });

    it('test password-form change event', function () {
        const wrapper = shallow(<GeneralSettings/>);
        wrapper.setState({passwordsupport: true});

        const event = {target: {name: 'pollName', value: 'test'}};
        expect(wrapper.state().password).not.toBe('test');
        wrapper.find('[data-testid=\'passwordfield\']').find('FormControl').simulate('change', event);
        expect(wrapper.state().password).toBe('test');
    });

    it('test tmdbsupport change event', function () {
        const wrapper = shallow(<GeneralSettings/>);
        wrapper.setState({tmdbsupport: true});

        expect(wrapper.state().tmdbsupport).toBe(true);
        wrapper.find('[data-testid=\'tmdb-switch\']').simulate('change');
        expect(wrapper.state().tmdbsupport).toBe(false);
    });

    it('test insertion of 4 infoheaderitems', function () {
        const wrapper = shallow(<GeneralSettings/>);
        expect(wrapper.find('InfoHeaderItem').length).toBe(4);
    });
});
