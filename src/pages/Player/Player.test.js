import {shallow} from 'enzyme';
import React from 'react';
import {Player} from './Player';
import {callAPI} from '../../utils/Api';
import GlobalInfos from "../../utils/GlobalInfos";
import {LoginContext} from '../../utils/context/LoginContext';

describe('<Player/>', function () {

    // help simulating id passed by url
    function instance() {
        return shallow(<Player match={{params: {id: 10}}}/>, {context: LoginContext});
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
        wrapper.find('.videoactions').find('IconButton').first().simulate('click');
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
        wrapper.find('.videoactions').find('IconButton').at(1).simulate('click');
        // addtagpopup should be showing now
        expect(wrapper.find('AddTagPopup')).toHaveLength(1);
    });

    it('test fully delete popup rendering', function () {
        const wrapper = instance();

        wrapper.setContext({VideosFullyDeleteable: true})

        wrapper.setState({deletepopupvisible: true});

        expect(wrapper.find('ButtonPopup')).toHaveLength(1)
    });

    it('test delete button', () => {
        const wrapper = instance();
        const callback = jest.fn();

        wrapper.setProps({history: {goBack: callback}});

        callAPIMock({result: 'success'})
        wrapper.setContext({VideosFullyDeleteable: false})

        // request the popup to pop
        wrapper.find('.videoactions').find('IconButton').at(2).simulate('click');

        // click the first submit button
        wrapper.find('ButtonPopup').dive().find('Button').at(0).simulate('click')

        // refetch is called so fetch called 3 times
        expect(callAPI).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledTimes(1);

        // now lets test if this works also with the fullydeletepopup
        wrapper.setContext({VideosFullyDeleteable: true})
        // request the popup to pop
        wrapper.setState({deletepopupvisible: true}, () => {
            // click the first submit button
            wrapper.find('ButtonPopup').dive().find('Button').at(0).simulate('click')

            expect(callAPI).toHaveBeenCalledTimes(2);
            expect(callback).toHaveBeenCalledTimes(2);
        });
    });

    it('hide click ', function () {
        const wrapper = instance();

        const func = jest.fn();

        wrapper.setProps({history: {push: func}});

        expect(func).toHaveBeenCalledTimes(0);
        wrapper.find('.closebutton').simulate('click');
        // there shouldn't be a backstack available
        expect(func).toHaveBeenCalledTimes(1);
    });

    it('hide click with stack available', function () {
        const wrapper = instance();

        const func = jest.fn();

        wrapper.setProps({history: {goBack: func, length: 5}});

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

        callAPIMock({result: 'success'})

        // render tag subcomponent
        const tag = wrapper.find('Tag').first().dive();
        tag.simulate('click');

        process.nextTick(() => {
            expect(callAPI).toHaveBeenCalledTimes(1);
            done();
        });
    });

    it('test failing quickadd', done => {
        const wrapper = generatetag();

        callAPIMock({result: 'nonsuccess'});
        global.console.error = jest.fn();

        // render tag subcomponent
        const tag = wrapper.find('Tag').first().dive();
        tag.simulate('click');

        process.nextTick(() => {
            expect(global.console.error).toHaveBeenCalledTimes(2);
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
