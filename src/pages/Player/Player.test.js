import {shallow} from 'enzyme';
import React from 'react';
import {Player} from './Player';
import {callAPI} from '../../utils/Api';

describe('<Player/>', function () {

    // help simulating id passed by url
    function instance() {
        return shallow(<Player match={{params: {id: 10}}}/>);
    }

    it('renders without crashing ', function () {
        const wrapper = instance();
        wrapper.unmount();
    });

    it('plyr insertion', function () {
        const wrapper = instance();

        wrapper.setState({
            sources: [
                {
                    src: '/tstvid.mp4',
                    type: 'video/mp4',
                    size: 1080
                }
            ]
        });

        expect(wrapper.find('Plyr').dive().find('video')).toHaveLength(1);
    });

    function simulateLikeButtonClick() {
        const wrapper = instance();

        // initial fetch for getting movie data
        expect(global.fetch).toHaveBeenCalledTimes(1);
        wrapper.find('.videoactions').find('Button').first().simulate('click');
        // fetch for liking
        expect(global.fetch).toHaveBeenCalledTimes(2);

        return wrapper;
    }

    it('likebtn click', done => {
        global.fetch = global.prepareFetchApi({result: 'success'});
        global.console.error = jest.fn();

        simulateLikeButtonClick();


        process.nextTick(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.console.error).toHaveBeenCalledTimes(0);

            global.fetch.mockClear();
            done();
        });
    });

    it('errored likebtn click', done => {
        global.fetch = global.prepareFetchApi({result: 'nosuccess'});
        global.console.error = jest.fn();

        simulateLikeButtonClick();

        process.nextTick(() => {
            // refetch is called so fetch called 3 times
            expect(global.fetch).toHaveBeenCalledTimes(2);
            expect(global.console.error).toHaveBeenCalledTimes(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('show tag popup', function () {
        const wrapper = instance();
        expect(wrapper.find('AddTagPopup')).toHaveLength(0);
        // todo dynamic button find without index
        wrapper.find('.videoactions').find('Button').at(1).simulate('click');
        // addtagpopup should be showing now
        expect(wrapper.find('AddTagPopup')).toHaveLength(1);
    });

    it('test delete button', done => {
        const wrapper = instance();


        wrapper.setProps({history: {goBack: jest.fn()}});

        global.fetch = prepareFetchApi({result: 'success'});

        wrapper.find('.videoactions').find('Button').at(2).simulate('click');

        process.nextTick(() => {
            // refetch is called so fetch called 3 times
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(wrapper.instance().props.history.goBack).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });

    it('hide click ', function () {
        const wrapper = instance();

        const func = jest.fn();

        wrapper.setProps({history: {goBack: func}});

        expect(func).toHaveBeenCalledTimes(0);
        wrapper.find('.closebutton').simulate('click');
        // backstack should be popped once
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('inserts Tags correctly', function () {
        const wrapper = instance();

        expect(wrapper.find('Tag')).toHaveLength(0);

        wrapper.setState({
            tags: [
                {tag_name: 'first'},
                {tag_name: 'second'}
            ]
        });

        expect(wrapper.find('Tag')).toHaveLength(2);
    });

    it('inserts tag quickadd correctly', function () {
        generatetag();
    });

    it('test click of quickadd tag btn', done => {
        const wrapper = generatetag();

        global.fetch = prepareFetchApi({result: 'success'});

        // render tag subcomponent
        const tag = wrapper.find('Tag').first().dive();
        tag.simulate('click');

        process.nextTick(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);

            global.fetch.mockClear();
            done();
        });
    });

    it('test failing quickadd', done => {
        const wrapper = generatetag();

        global.fetch = prepareFetchApi({result: 'nonsuccess'});
        global.console.error = jest.fn();

        // render tag subcomponent
        const tag = wrapper.find('Tag').first().dive();
        tag.simulate('click');

        process.nextTick(() => {
            expect(global.console.error).toHaveBeenCalledTimes(2);

            global.fetch.mockClear();
            done();
        });
    });

    it('showspopups correctly', function () {
        const wrapper = instance();

        wrapper.setState({popupvisible: true}, () => {
            // is the AddTagpopu rendered?
            expect(wrapper.find('AddTagPopup')).toHaveLength(1);
            wrapper.setState({popupvisible: false, actorpopupvisible: true}, () => {
                // actorpopup rendred and tagpopup hidden?
                expect(wrapper.find('AddTagPopup')).toHaveLength(0);
                expect(wrapper.find('AddActorPopup')).toHaveLength(1);
            });
        });
    });


    it('quickadd tag correctly', function () {
        const wrapper = instance();
        global.callAPIMock({result: 'success'});

        wrapper.setState({suggesttag: [{TagName: 'test', TagId: 1}]}, () => {
            // mock funtion should have not been called
            expect(callAPI).toBeCalledTimes(0);
            wrapper.find('Tag').findWhere(p => p.props().tagInfo.TagName === 'test').dive().simulate('click');
            // mock function should have been called once
            expect(callAPI).toBeCalledTimes(1);

            // expect tag added to video tags
            expect(wrapper.state().tags).toMatchObject([{TagName: 'test'}]);
            // expect tag to be removed from tag suggestions
            expect(wrapper.state().suggesttag).toHaveLength(0);
        });
    });

    it('test adding of already existing tag', function () {
        const wrapper = instance();
        global.callAPIMock({result: 'success'});

        wrapper.setState({suggesttag: [{tag_name: 'test', tag_id: 1}], tags: [{tag_name: 'test', tag_id: 1}]}, () => {
            // mock funtion should have not been called
            expect(callAPI).toBeCalledTimes(0);
            wrapper.find('Tag').findWhere(p => p.props().tagInfo.tag_name === 'test').last().dive().simulate('click');
            // mock function should have been called once
            expect(callAPI).toBeCalledTimes(1);

            // there should not been added a duplicate of tag so object stays same...
            expect(wrapper.state().tags).toMatchObject([{tag_name: 'test'}]);
            // the suggestion tag shouldn't be removed (this can't actually happen in rl
            // because backennd doesn't give dupliacate suggestiontags)
            expect(wrapper.state().suggesttag).toHaveLength(1);
        });
    });

    function generatetag() {
        const wrapper = instance();

        expect(wrapper.find('Tag')).toHaveLength(0);

        wrapper.setState({
            suggesttag: [
                {tag_name: 'first', tag_id: 1}
            ]
        });

        expect(wrapper.find('Tag')).toHaveLength(1);

        return wrapper;
    }

    it('test addactor popup showing', function () {
        const wrapper = instance();

        expect(wrapper.find('AddActorPopup')).toHaveLength(0);

        wrapper.instance().addActor();

        // check if popup is visible
        expect(wrapper.find('AddActorPopup')).toHaveLength(1);
    });

    it('test hiding of addactor popup', function () {
        const wrapper = instance();
        wrapper.instance().addActor();

        expect(wrapper.find('AddActorPopup')).toHaveLength(1);

        wrapper.find('AddActorPopup').props().onHide();

        expect(wrapper.find('AddActorPopup')).toHaveLength(0);
    });

    it('test addtagpopup hiding', function () {
        const wrapper = instance();

        wrapper.setState({popupvisible: true});
        expect(wrapper.find('AddTagPopup')).toHaveLength(1);

        wrapper.find('AddTagPopup').props().onHide();

        expect(wrapper.find('AddTagPopup')).toHaveLength(0);
    });

    it('test insertion of actor tiles', function () {
        const wrapper = instance();
        wrapper.setState({
            actors: [{
                thumbnail: '',
                name: 'testname',
                actor_id: 42
            }]
        });

        expect(wrapper.find('ActorTile')).toHaveLength(1);
    });

    it('test Addactor button', function () {
        const wrapper = instance();
        expect(wrapper.state().actorpopupvisible).toBe(false);
        wrapper.find('.actorAddTile').simulate('click');

        expect(wrapper.state().actorpopupvisible).toBe(true);
    });
});
