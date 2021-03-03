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
            Videos: [{
                MovieId: 0,
                MovieName: 'test'
            }], Info: {
                Thumbnail: '',
                Name: '',
                ActorId: 0
            }
        });

        const wrapper = shallow(<ActorPage match={{params: {id: 10}}}/>);

        expect(wrapper.find('VideoContainer')).toHaveLength(1);
    });
});
