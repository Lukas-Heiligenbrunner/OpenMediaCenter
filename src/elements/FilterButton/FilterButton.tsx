import React from 'react';
import style from '../Popups/AddActorPopup/AddActorPopup.module.css';
import {Button} from '../GPElements/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faFilter, faTimes} from '@fortawesome/free-solid-svg-icons';
import {addKeyHandler, removeKeyHandler} from '../../utils/ShortkeyHandler';

interface Props {
    onFilterChange: (filter: string) => void;
}

interface state {
    filtervisible: boolean;
    filter: string;
}

class FilterButton extends React.Component<Props, state> {
    // filterfield anchor, needed to focus after filter btn click
    private filterfield: HTMLInputElement | null | undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            filtervisible: false,
            filter: ''
        };

        this.keypress = this.keypress.bind(this);
        this.enableFilterField = this.enableFilterField.bind(this);
    }

    componentWillUnmount(): void {
        removeKeyHandler(this.keypress);
    }

    componentDidMount(): void {
        addKeyHandler(this.keypress);
    }

    render(): JSX.Element {
        if (this.state.filtervisible) {
            return (
                <>
                    <input
                        className={'form-control mr-sm-2 ' + style.searchinput}
                        type='text'
                        placeholder='Filter'
                        value={this.state.filter}
                        onChange={(e): void => {
                            this.props.onFilterChange(e.target.value);
                            this.setState({filter: e.target.value});
                        }}
                        ref={(input): void => {
                            this.filterfield = input;
                        }}
                    />
                    <Button
                        title={
                            <FontAwesomeIcon
                                style={{
                                    verticalAlign: 'middle',
                                    lineHeight: '130px'
                                }}
                                icon={faTimes}
                                size='1x'
                            />
                        }
                        color={{backgroundColor: 'red'}}
                        onClick={(): void => {
                            this.setState({filter: '', filtervisible: false});
                        }}
                    />
                </>
            );
        } else {
            return (
                <Button
                    title={
                        <span>
                            Filter{' '}
                            <FontAwesomeIcon
                                style={{
                                    verticalAlign: 'middle',
                                    lineHeight: '130px'
                                }}
                                icon={faFilter}
                                size='1x'
                            />
                        </span>
                    }
                    color={{backgroundColor: 'cornflowerblue', color: 'white'}}
                    onClick={this.enableFilterField}
                />
            );
        }
    }

    /**
     * enable filterfield and focus into searchbar
     */
    private enableFilterField(): void {
        this.setState({filtervisible: true}, () => {
            // focus filterfield after state update
            this.filterfield?.focus();
        });
    }

    /**
     * key event handling
     * @param event keyevent
     */
    private keypress(event: KeyboardEvent): void {
        // hide if escape is pressed
        if (event.key === 'f') {
            this.enableFilterField();
        }
    }
}

export default FilterButton;
