import React from "react";
import ReactDom from 'react-dom';
import style from './AddTagPopup.module.css'
import Tag from "../Tag/Tag";
import {Line} from "../PageTitle/PageTitle";

/**
 * component creates overlay to add a new tag to a video
 */
class AddTagPopup extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {items: []};
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.props = props;
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside);

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
        return (
            <div className={style.popup}>
                <div className={style.header}>Add a Tag to this Video:</div>
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
}

export default AddTagPopup;
