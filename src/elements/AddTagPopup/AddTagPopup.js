import React from "react";
import ReactDom from 'react-dom';
import style from './AddTagPopup.module.css'
import Tag from "../Tag/Tag";
import {Line} from "../PageTitle/PageTitle";
import GlobalInfos from "../../GlobalInfos";

/**
 * component creates overlay to add a new tag to a video
 */
class AddTagPopup extends React.Component {
    /// instance of root element
    element;

    constructor(props, context) {
        super(props, context);

        this.state = {items: []};
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.keypress = this.keypress.bind(this);

        this.props = props;
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);
        document.addEventListener('keyup', this.keypress);

        // add element drag drop events
        if (this.element != null) {
            this.dragElement();
        }

        const updateRequest = new FormData();
        updateRequest.append('action', 'getAllTags');

        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    items: result
                });
            });
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
        document.removeEventListener('keyup', this.keypress);
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

    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <div className={[style.popup, themeStyle.thirdbackground].join(' ')} ref={el => this.element = el}>
                <div className={[style.header, themeStyle.textcolor].join(' ')}>Add a Tag to this Video:</div>
                <Line/>
                <div className={style.content}>
                    {this.state.items ?
                        this.state.items.map((i) => (
                            <Tag onclick={() => {
                                this.addTag(i.tag_id, i.tag_name);
                            }}>{i.tag_name}</Tag>
                        )) : null}
                </div>
            </div>
        );
    }

    /**
     * add a new tag to this video
     * @param tagid tag id to add
     * @param tagname tag name to add
     */
    addTag(tagid, tagname) {
        console.log(this.props)
        const updateRequest = new FormData();
        updateRequest.append('action', 'addTag');
        updateRequest.append('id', tagid);
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.result !== "success") {
                        console.log("error occured while writing to db -- todo error handling");
                        console.log(result.result);
                    } else {
                        this.props.submit(tagid, tagname);
                    }
                    this.props.onHide();
                }));
    }

    /**
     * key event handling
     * @param event keyevent
     */
    keypress(event) {
        // hide if escape is pressed
        if (event.key === "Escape") {
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
            elmnt.style.top = (elmnt.offsetTop - dy) + "px";
            elmnt.style.left = (elmnt.offsetLeft - dx) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

export default AddTagPopup;
