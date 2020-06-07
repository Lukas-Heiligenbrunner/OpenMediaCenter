import React from "react";
import Preview from "./Preview";

class VideoContainer extends React.Component {
    constructor(props: P, context: any) {
        super(props, context);

        this.data = props.data;

        this.state = {
            loadeditems: [],
            selectionnr: null
        };
    }
    // stores current index of loaded elements
    loadindex = 0;

    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);

        this.loadPreviewBlock(12);
    }

    render() {
        return (
            <div className='maincontent'>
                {this.state.loadeditems.map(elem => (
                    <Preview
                        key={elem.movie_id}
                        name={elem.movie_name}
                        movie_id={elem.movie_id}
                        viewbinding={this.props.viewbinding}/>
                ))}
            </div>
        );
    }

    componentWillUnmount() {
        this.setState({});
        document.removeEventListener('scroll', this.trackScrolling);
    }

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

    trackScrolling = () => {
        // comparison if current scroll position is on bottom
        // 200 stands for bottom offset to trigger load
        if (window.innerHeight + document.documentElement.scrollTop + 200 >= document.documentElement.offsetHeight) {
            this.loadPreviewBlock(8);
        }
    }
}

export default VideoContainer;