import React from 'react';
import style from './DynamicContentContainer.module.css';

interface Props<T> {
    renderElement: (elem: T) => JSX.Element;
    data: T[];
    initialLoadNr?: number;
}

interface state<T> {
    loadeditems: T[];
    selectionnr: number;
}

/**
 * A videocontainer storing lots of Preview elements
 * includes scroll handling and loading of preview infos
 */
class DynamicContentContainer<T> extends React.Component<Props<T>, state<T>> {
    // stores current index of loaded elements
    loadindex: number = 0;

    constructor(props: Props<T>) {
        super(props);

        this.state = {
            loadeditems: [],
            selectionnr: 0
        };
    }

    componentDidMount(): void {
        document.addEventListener('scroll', this.trackScrolling);

        this.loadPreviewBlock(this.props.initialLoadNr ? this.props.initialLoadNr : 16);
    }

    render(): JSX.Element {
        return (
            <div className={style.maincontent}>
                {this.state.loadeditems.map((elem) => {
                    return this.props.renderElement(elem);
                })}
                {/*todo css for no items to show*/}
                {this.state.loadeditems.length === 0 ? 'no items to show!' : null}
                {this.props.children}
            </div>
        );
    }

    componentWillUnmount(): void {
        // unbind scroll listener when unmounting component
        document.removeEventListener('scroll', this.trackScrolling);
    }

    /**
     * load previews to the container
     * @param nr number of previews to load
     */
    loadPreviewBlock(nr: number): void {
        let ret = [];
        for (let i = 0; i < nr; i++) {
            // only add if not end
            if (this.props.data.length > this.loadindex + i) {
                ret.push(this.props.data[this.loadindex + i]);
            }
        }

        this.setState({
            loadeditems: [...this.state.loadeditems, ...ret]
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

export default DynamicContentContainer;
