import React from "react";

import styles from "./Tag.module.css"
import CategoryPage from "../../pages/CategoryPage/CategoryPage";

class Tag extends React.Component {
    render() {
        return (
            <button className={styles.tagbtn} onClick={() => this.TagClick()}
                    data-testid="Test-Tag">{this.props.children}</button>
        );
    }

    TagClick() {
        const tag = this.props.children.toString().toLowerCase();

        this.props.viewbinding.changeRootElement(
            <CategoryPage
                category={tag}
                viewbinding={this.props.viewbinding}/>);
    }
}

export default Tag;
