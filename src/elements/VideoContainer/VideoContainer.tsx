import React from 'react';
import Preview from '../Preview/Preview';
import style from './VideoContainer.module.css';
import {VideoTypes} from '../../types/ApiTypes';

interface props {
    data: VideoTypes.VideoUnloadedType[]
}

interface state {
    loadeditems: VideoTypes.VideoUnloadedType[];
    selectionnr: number;
}

/**
 * A videocontainer storing lots of Preview elements
 * includes scroll handling and loading of preview infos
 */
class VideoContainer extends React.Component<props, state> {
    // stores current index of loaded elements
    loadindex: number = 0;

    constructor(props: props) {
        super(props);

        this.state = {
            loadeditems: [],
            selectionnr: 0
        };
    }

    componentDidMount(): void {
        document.addEventListener('scroll', this.trackScrolling);

        this.loadPreviewBlock(16);
    }

    render(): JSX.Element {
        return (
            <div className={style.maincontent}>
                {this.state.loadeditems.map(elem => (
                    <Preview
                        key={elem.movie_id}
                        name={elem.movie_name}
                        movie_id={elem.movie_id}/>
                ))}
                {/*todo css for no items to show*/}
                {this.state.loadeditems.length === 0 ?
                    'no items to show!' : null}
                {this.props.children}
            </div>
        );
    }

    componentWillUnmount(): void {
        this.setState({});
        // unbind scroll listener when unmounting component
        document.removeEventListener('scroll', this.trackScrolling);
    }

    /**
     * load previews to the container
     * @param nr number of previews to load
     */
    loadPreviewBlock(nr: number): void {
        console.log('loadpreviewblock called ...');
        let ret = [];
        for (let i = 0; i < nr; i++) {
            // only add if not end
            if (this.props.data.length > this.loadindex + i) {
                ret.push(this.props.data[this.loadindex + i]);
            }
        }

        this.setState({
            loadeditems: [
                ...this.state.loadeditems,
                ...ret
            ]
        });


        this.loadindex += nr;
    }

    /**
     * scroll event handler -> load new previews if on bottom
     */
    trackScrolling = (): void => {
        // comparison if current scroll position is on bottom --> 200 is bottom offset to trigger load
        if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
            this.loadPreviewBlock(8);
        }
    };
}

export default VideoContainer;
