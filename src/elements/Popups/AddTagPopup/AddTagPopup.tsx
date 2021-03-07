import React from 'react';
import Tag from '../../Tag/Tag';
import PopupBase from '../PopupBase';
import {APINode, callAPI} from '../../../utils/Api';
import {TagType} from '../../../types/VideoTypes';
import FilterButton from "../../FilterButton/FilterButton";
import styles from './AddTagPopup.module.css'

interface props {
    onHide: () => void;
    submit: (tagId: number, tagName: string) => void;
    movie_id: number;
}

interface state {
    items: TagType[];
    filter: string;
}

/**
 * component creates overlay to add a new tag to a video
 */
class AddTagPopup extends React.Component<props, state> {
    constructor(props: props) {
        super(props);

        this.state = {items: [], filter: ''};

        this.tagFilter = this.tagFilter.bind(this);
        this.parentSubmit = this.parentSubmit.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }

    componentDidMount(): void {
        callAPI(APINode.Tags, {action: 'getAllTags'}, (result: TagType[]) => {
            this.setState({
                items: result
            });
        });
    }

    render(): JSX.Element {
        return (
            <PopupBase title='Add a Tag to this Video:' onHide={this.props.onHide} ParentSubmit={this.parentSubmit}>
                <div className={styles.actionbar}>
                    <FilterButton onFilterChange={(filter): void => this.setState({filter: filter})}/>
                </div>
                {this.state.items ?
                    this.state.items.filter(this.tagFilter).map((i) => (
                        <Tag tagInfo={i}
                             onclick={(): void => this.onItemClick(i)}/>
                    )) : null}
            </PopupBase>
        );
    }

    private onItemClick(tag: TagType): void {
        this.props.submit(tag.TagId, tag.TagName);
        this.props.onHide();
    }

    private tagFilter(tag: TagType): boolean {
        return tag.TagName.toLowerCase().includes(this.state.filter.toLowerCase());
    }

    private parentSubmit(): void {
        // allow submit only if one item is left in selection
        const filteredList = this.state.items.filter(this.tagFilter);

        if (filteredList.length === 1) {
            // simulate click if parent submit
            this.onItemClick(filteredList[0]);
        }
    }
}

export default AddTagPopup;
