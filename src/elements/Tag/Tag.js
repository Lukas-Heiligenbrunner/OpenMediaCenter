import React from 'react';

import styles from './Tag.module.css';
import CategoryPage from '../../pages/CategoryPage/CategoryPage';
import GlobalInfos from '../../utils/GlobalInfos';

/**
 * A Component representing a single Category tag
 */
class Tag extends React.Component {
    render() {
        return (
            <button className={styles.tagbtn} onClick={() => this.TagClick()}
                    data-testid='Test-Tag'>{this.props.children}</button>
        );
    }

    /**
     * click handling for a Tag
     */
    TagClick() {
        const tag = this.props.children.toString().toLowerCase();

        if (this.props.onclick) {
            this.props.onclick(tag);
            return;
        }

        // call callback functin to switch to category page with specified tag
        GlobalInfos.getViewBinding().changeRootElement(
            <CategoryPage category={tag}/>);
    }
}

export default Tag;
