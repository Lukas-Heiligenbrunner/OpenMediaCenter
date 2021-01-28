import React from 'react';
import Tag from '../../Tag/Tag';
import PopupBase from '../PopupBase';
import {callAPI} from '../../../utils/Api';
import {TagType} from '../../../types/VideoTypes';

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
                                 this.props.submit(i.tag_id, i.tag_name);
                                 this.props.onHide();
                             }}/>
                    )) : null}
            </PopupBase>
        );
    }
}

export default AddTagPopup;
