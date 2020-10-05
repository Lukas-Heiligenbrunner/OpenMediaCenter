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
        if(this.element != null){
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
            <div className={[style.popup, themeStyle.thirdbackground].join(' ')} ref={el => this.element = el }>
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
        if (event.key === "Escape"){
            this.props.onHide();
        }
    }

    /**
     * make the element drag and droppable
     */
    dragElement() {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        console.log(this.props);

        const elmnt = this.element;
        elmnt.firstChild.onmousedown = dragMouseDown;


        function dragMouseDown(e) {
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

export default AddTagPopup;
