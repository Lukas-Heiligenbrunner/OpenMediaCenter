import React from 'react';

import styles from './Tag.module.css';
import {Link} from 'react-router-dom';
import {TagType} from '../../api/VideoTypes';

interface props {
    onclick?: (_: string) => void
    tagInfo: TagType
}

/**
 * A Component representing a single Category tag
 */
class Tag extends React.Component<props> {
    render(): JSX.Element {
        if (this.props.onclick) {
            return this.renderButton();
        } else {
            return (
                <Link to={'/categories/' + this.props.tagInfo.tag_id}>
                    {this.renderButton()}
                </Link>
            );
        }
    }

    renderButton(): JSX.Element {
        return (
            <button className={styles.tagbtn} onClick={(): void => this.TagClick()}
                    data-testid='Test-Tag'>{this.props.tagInfo.tag_name}</button>
        );
    }

    /**
     * click handling for a Tag
     */
    TagClick(): void {
        if (this.props.onclick) {
            // call custom onclick handling
            this.props.onclick(this.props.tagInfo.tag_name); // todo check if param is neccessary
            return;
        }
    }
}

export default Tag;
