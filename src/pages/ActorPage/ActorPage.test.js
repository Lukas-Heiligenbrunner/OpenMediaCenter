import {shallow} from 'enzyme';
import React from 'react';
import {ActorPage} from './ActorPage';

describe('<ActorPage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<ActorPage match={{params: {id: 10}}}/>);
        wrapper.unmount();
    });

    it('fetch infos', function () {
        callAPIMock({
            videos: [{
                movie_id: 0,
                movie_name: 'test'
            }], info: {
                thumbnail: '',
                name: '',
                actor_id: 0
            }
        });

        const wrapper = shallow(<ActorPage match={{params: {id: 10}}}/>);

        expect(wrapper.find('VideoContainer')).toHaveLength(1);
    });
});
