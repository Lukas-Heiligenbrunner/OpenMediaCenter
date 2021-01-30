import React, {RefObject} from 'react';
import style from './QuickActionPopup.module.css';

interface props {
    position: {
        x: number,
        y: number
    },
    onHide: () => void
}

class QuickActionPop extends React.Component<props> {
    private readonly wrapperRef: RefObject<HTMLDivElement>;

    constructor(props: props) {
        super(props);

        this.wrapperRef = React.createRef();

        this.handleClickOutside = this.handleClickOutside.bind(this);
    }


    componentDidMount(): void {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount(): void {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render(): JSX.Element {
        return (
            <div ref={this.wrapperRef} className={style.quickaction} style={{top: this.props.position.y, left: this.props.position.x}}>
                {this.props.children}
            </div>
        );
    }

    /**
     * trigger hide if we click outside the div
     */
    handleClickOutside(event: MouseEvent): void {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target as Node)) {
            this.props.onHide();
        }
    }
}

export default QuickActionPop;
