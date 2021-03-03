import React, {SyntheticEvent} from 'react';

import styles from './Tag.module.css';
import {Link} from 'react-router-dom';
import {TagType} from '../../types/VideoTypes';

interface props {
    onclick?: (_: string) => void;
    tagInfo: TagType;
    onContextMenu?: (pos: {x: number, y: number}) => void
}

interface state {
    contextVisible: boolean
}

/**
 * A Component representing a single Category tag
 */
class Tag extends React.Component<props, state> {
    constructor(props: Readonly<props> | props) {
        super(props);

        this.state = {
            contextVisible: false
        };

        this.contextmenu = this.contextmenu.bind(this);
    }

    render(): JSX.Element {
        if (this.props.onclick) {
            return this.renderButton();
        } else {
            return (
                <Link to={'/categories/' + this.props.tagInfo.TagId}>
                    {this.renderButton()}
                </Link>
            );
        }
    }

    renderButton(): JSX.Element {
        return (
            <span className={styles.tagbtnContainer}>
                <button className={styles.btnnostyle}
                        onClick={(): void => this.TagClick()}
                        onContextMenu={this.contextmenu}
                        data-testid='Test-Tag'>{this.props.tagInfo.TagName}</button>
                <span className={styles.deletebtn}>X</span>
            </span>
        );
    }

    /**
     * click handling for a Tag
     */
    TagClick(): void {
        if (this.props.onclick) {
            // call custom onclick handling
            this.props.onclick(this.props.tagInfo.TagName); // todo check if param is neccessary
            return;
        }
    }

    /**
     * handle a custom contextmenu for this item
     * @param e
     * @private
     */
    private contextmenu(e: SyntheticEvent): void {
        if (!this.props.onContextMenu) return;

        const event = e as unknown as PointerEvent;
        event.preventDefault();
        this.props.onContextMenu({x: event.clientX, y: event.clientY});
        // this.setState({contextVisible: true});
    }
}

export default Tag;
