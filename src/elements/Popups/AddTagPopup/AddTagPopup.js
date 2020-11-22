import React from 'react';
import Tag from '../../Tag/Tag';
import PopupBase from "../PopupBase";

/**
 * component creates overlay to add a new tag to a video
 */
class AddTagPopup extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {items: []};
    }

    componentDidMount() {
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

    render() {
        return (
            <PopupBase title='Add a Tag to this Video:' onHide={this.props.onHide}>
                {this.state.items ?
                    this.state.items.map((i) => (
                        <Tag onclick={() => {
                            this.addTag(i.tag_id, i.tag_name);
                        }}>{i.tag_name}</Tag>
                    )) : null}
            </PopupBase>
        );
    }

    /**
     * add a new tag to this video
     * @param tagid tag id to add
     * @param tagname tag name to add
     */
    addTag(tagid, tagname) {
        console.log(this.props);
        const updateRequest = new FormData();
        updateRequest.append('action', 'addTag');
        updateRequest.append('id', tagid);
        updateRequest.append('movieid', this.props.movie_id);

        fetch('/api/tags.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.result !== 'success') {
                        console.log('error occured while writing to db -- todo error handling');
                        console.log(result.result);
                    } else {
                        this.props.submit(tagid, tagname);
                    }
                    this.props.onHide();
                }));
    }
}

export default AddTagPopup;
