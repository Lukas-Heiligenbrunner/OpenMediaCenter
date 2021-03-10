import React from 'react';
import Preview from '../Preview/Preview';
import style from './VideoContainer.module.css';
import {VideoTypes} from '../../types/ApiTypes';

interface props {
    data: VideoTypes.VideoUnloadedType[];
    onScrollPositionChange?: (scrollPos: number, loadedTiles: number) => void;
    initialScrollPosition?: {scrollPos: number, loadedTiles: number};
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

        console.log(this.props.initialScrollPosition)
        if(this.props.initialScrollPosition !== undefined){
            this.loadPreviewBlock(this.props.initialScrollPosition.loadedTiles, () => {
                if(this.props.initialScrollPosition !== undefined)
                window.scrollTo(0, this.props.initialScrollPosition.scrollPos);
            });
        }else{
            this.loadPreviewBlock(16);
        }

    }

    render(): JSX.Element {
        return (
            <div className={style.maincontent}>
                {this.state.loadeditems.map(elem => (
                    <Preview
                        key={elem.MovieId}
                        name={elem.MovieName}
                        movie_id={elem.MovieId}
                    onClick={(): void => {
                        if (this.props.onScrollPositionChange !== undefined)
                            this.props.onScrollPositionChange(window.pageYOffset - document.documentElement.clientHeight, this.loadindex)
                    }}/>
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
    loadPreviewBlock(nr: number, callback? : () => void): void {
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
        }, callback);


        this.loadindex += nr;
    }

    /**
     * scroll event handler -> load new previews if on bottom
     */
    trackScrolling = (): void => {
        // comparison if current scroll position is on bottom --> 200 is bottom offset to trigger load
        if (document.documentElement.clientHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
            this.loadPreviewBlock(8);
            if (this.props.onScrollPositionChange !== undefined)
                this.props.onScrollPositionChange(document.documentElement.clientHeight + window.pageYOffset, this.loadindex)
        }
    };
}

export default VideoContainer;
