import React from 'react';
import Tag from '../../Tag/Tag';
import PopupBase from '../PopupBase';
import {callAPI} from '../../../utils/Api';
import {TagType} from '../../../types/VideoTypes';
import {GeneralSuccess} from '../../../types/GeneralTypes';

interface props {
    onHide: () => void;
    submit: (tagId: number, tagName: string) => void;
    movie_id: number;
}

interface state {
    items: TagType[];
}

/**
 * component creates overlay to add a new tag to a video
 */
class AddTagPopup extends React.Component<props, state> {
    constructor(props: props) {
        super(props);

        this.state = {items: []};
    }

    componentDidMount(): void {
        callAPI('tags.php', {action: 'getAllTags'}, (result: TagType[]) => {
            this.setState({
                items: result
            });
        });
    }

    render(): JSX.Element {
        return (
            <PopupBase title='Add a Tag to this Video:' onHide={this.props.onHide}>
                {this.state.items ?
                    this.state.items.map((i) => (
                        <Tag tagInfo={i}
                             onclick={(): void => {
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
    addTag(tagid: number, tagname: string): void {
        callAPI('tags.php', {action: 'addTag', id: tagid, movieid: this.props.movie_id}, (result: GeneralSuccess) => {
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
