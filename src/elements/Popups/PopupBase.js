import GlobalInfos from '../../GlobalInfos';
import style from './PopupBase.module.css';
import {Line} from '../PageTitle/PageTitle';
import React from 'react';
import ReactDom from 'react-dom';

/**
 * wrapper class for generic types of popups
 */
class PopupBase extends React.Component {
    /// instance of root element
    element;

    constructor(props) {
        super(props);

        this.state = {items: []};
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.keypress = this.keypress.bind(this);

        // parse style props
        this.framedimensions = {
            width: (this.props.width ? this.props.width : undefined),
            height: (this.props.height ? this.props.height : undefined)
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
        document.addEventListener('keyup', this.keypress);

        // add element drag drop events
        if (this.element != null) {
            this.dragElement();
        }
    }

    componentWillUnmount() {
        // remove the appended listeners
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keyup', this.keypress);
    }

    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div style={this.framedimensions} className={[style.popup, themeStyle.thirdbackground].join(' ')} ref={el => this.element = el}>
                <div className={[style.header, themeStyle.textcolor].join(' ')}>{this.props.title}</div>
                <Line/>
                <div className={style.content}>
                    {this.props.children}
                </div>
            </div>
        );
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        const domNode = ReactDom.findDOMNode(this);

        if (!domNode || !domNode.contains(event.target)) {
            this.props.onHide();
        }
    }

    /**
     * key event handling
     * @param event keyevent
     */
    keypress(event) {
        // hide if escape is pressed
        if (event.key === 'Escape') {
            this.props.onHide();
        }
    }

    /**
     * make the element drag and droppable
     */
    dragElement() {
        let xOld = 0, yOld = 0;

        const elmnt = this.element;
        elmnt.firstChild.onmousedown = dragMouseDown;


        function dragMouseDown(e) {
            e.preventDefault();
            // get the mouse cursor position at startup:
            xOld = e.clientX;
            yOld = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            // calculate the new cursor position:
            const dx = xOld - e.clientX;
            const dy = yOld - e.clientY;
            xOld = e.clientX;
            yOld = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - dy) + 'px';
            elmnt.style.left = (elmnt.offsetLeft - dx) + 'px';
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

export default PopupBase;
