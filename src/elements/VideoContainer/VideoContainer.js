import React from "react";
import Preview from "../Preview/Preview";
import style from "./VideoContainer.module.css"

/**
 * A videocontainer storing lots of Preview elements
 * includes scroll handling and loading of preview infos
 */
class VideoContainer extends React.Component {
    // stores current index of loaded elements
    loadindex = 0;

    constructor(props, context) {
        super(props, context);

        this.data = props.data;

        this.state = {
            loadeditems: [],
            selectionnr: null
        };
    }

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);

        this.loadPreviewBlock(16);
    }

    render() {
        return (
            <div className={style.maincontent}>
                {this.state.loadeditems.map(elem => (
                    <Preview
                        key={elem.movie_id}
                        name={elem.movie_name}
                        movie_id={elem.movie_id}
                        viewbinding={this.props.viewbinding}/>
                ))}
                {/*todo css for no items to show*/}
                {this.state.loadeditems.length === 0 ?
                    "no items to show!" : null}
                {this.props.children}
            </div>
        );
    }

    componentWillUnmount() {
        this.setState({});
        // unbind scroll listener when unmounting component
        document.removeEventListener('scroll', this.trackScrolling);
    }

    /**
     * load previews to the container
     * @param nr number of previews to load
     */
    loadPreviewBlock(nr) {
        console.log("loadpreviewblock called ...")
        let ret = [];
        for (let i = 0; i < nr; i++) {
            // only add if not end
            if (this.data.length > this.loadindex + i) {
                ret.push(this.data[this.loadindex + i]);
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
    trackScrolling = () => {
        // comparison if current scroll position is on bottom --> 200 is bottom offset to trigger load
        if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
            this.loadPreviewBlock(8);
        }
    }
}

export default VideoContainer;
