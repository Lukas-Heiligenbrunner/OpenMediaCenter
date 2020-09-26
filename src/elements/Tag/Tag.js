import React from "react";

import styles from "./Tag.module.css"
import CategoryPage from "../../pages/CategoryPage/CategoryPage";

/**
 * A Component representing a single Category tag
 */
class Tag extends React.Component {
    render() {
        return (
            <button className={styles.tagbtn} onClick={() => this.TagClick()}
                    data-testid="Test-Tag">{this.props.children}</button>
        );
    }

    /**
     * click handling for a Tag
     */
    TagClick() {
        if (this.props.onclick) {
            this.props.onclick();
            return;
        }

        const tag = this.props.children.toString().toLowerCase();

        // call callback functin to switch to category page with specified tag
        this.props.viewbinding.changeRootElement(
            <CategoryPage
                category={tag}
                viewbinding={this.props.viewbinding}/>);
    }
}

export default Tag;
