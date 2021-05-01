import {shallow} from 'enzyme';
import React from 'react';
import {EpisodePage, EpisodeTile} from './EpisodePage';

describe('<EpisodePage/>', function () {
    it('renders without crashing ', function () {
        const wrapper = shallow(<EpisodePage  history={{}} location={{}} match={{params: {id: 42}}}/>);
        wrapper.unmount();
    });

    it('content showing when loaded', function () {
        const wrapper = shallow(<EpisodePage  history={{}} location={{}} match={{params: {id: 42}}}/>);

        expect(wrapper.find('DynamicContentContainer')).toHaveLength(0)

        wrapper.setState({loaded: true});

        expect(wrapper.find('DynamicContentContainer')).toHaveLength(1)
    });
});

describe('<EpisodeTile/>', () => {
    it('renders without crashing', function () {
        const wrapper = shallow(<EpisodeTile  episode={{
            ID: 0,
            Name: 'testname',
            Season: 0,
            Episode: 0
        }}/>);
        wrapper.unmount();
    });

    it('renders text', function () {
        const wrapper = shallow(<EpisodeTile  episode={{
            ID: 0,
            Name: 'testname',
            Season: 0,
            Episode: 0
        }}/>);

        expect(wrapper.findWhere(e => e.text() === 'testname')).toHaveLength(1)
    });
})
