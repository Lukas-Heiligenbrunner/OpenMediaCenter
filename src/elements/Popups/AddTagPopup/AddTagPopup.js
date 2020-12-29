import React from 'react';
import Tag from '../../Tag/Tag';
import PopupBase from '../PopupBase';
import {callAPI} from '../../../utils/Api';

/**
 * component creates overlay to add a new tag to a video
 */
class AddTagPopup extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {items: []};
    }

    componentDidMount() {
        callAPI('tags.php', {action: 'getAllTags'}, (result) => {
            console.log(result);
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
                        <Tag tagInfo={i}
                             onclick={() => {
                                 this.addTag(i.tag_id, i.tag_name);
                             }}/>
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
        callAPI('tags.php', {action: 'addTag', id: tagid, movieid: this.props.movie_id}, result => {
            if (result.result !== 'success') {
                console.log('error occured while writing to db -- todo error handling');
                console.log(result.result);
            } else {
                this.props.submit(tagid, tagname);
            }
            this.props.onHide();
        });
    }
}

export default AddTagPopup;
