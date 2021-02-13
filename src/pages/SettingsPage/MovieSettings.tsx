import React from 'react';
import style from './MovieSettings.module.css';
import {APINode, callAPI} from '../../utils/Api';
import {GeneralSuccess} from '../../types/GeneralTypes';
import {SettingsTypes} from '../../types/ApiTypes';

interface state {
    text: string[]
    startbtnDisabled: boolean
}

interface props {
}

/**
 * Component for MovieSettings on Settingspage
 * handles settings concerning to movies in general
 */
class MovieSettings extends React.Component<props, state> {
    myinterval: number = -1;

    constructor(props: props) {
        super(props);

        this.state = {
            text: [],
            startbtnDisabled: false
        };
    }

    componentDidMount(): void {
        this.myinterval = window.setInterval(this.updateStatus, 1000);
    }

    componentWillUnmount(): void {
        if (this.myinterval !== -1)
            clearInterval(this.myinterval);
    }

    render(): JSX.Element {
        return (
            <>
                <button disabled={this.state.startbtnDisabled}
                        className='btn btn-success'
                        onClick={(): void => {
                            this.startReindex();
                        }}>Reindex Movie
                </button>
                <button className='btn btn-warning'
                        onClick={(): void => {
                            this.cleanupGravity();
                        }}>Cleanup Gravity
                </button>
                <div className={style.indextextarea}>{this.state.text.map(m => (
                    <div className='textarea-element'>{m}</div>
                ))}</div>
            </>
        );
    }

    /**
     * starts the reindex process of the videos in the specified folder
     */
    startReindex(): void {
        // clear output text before start
        this.setState({text: [], startbtnDisabled: true});

        callAPI(APINode.Settings, {action: 'startReindex'}, (result: GeneralSuccess): void => {
            console.log(result);
            if (result.result === 'success') {
                console.log('started successfully');
            } else {
                console.log('error, reindex already running');
                this.setState({startbtnDisabled: true});
            }
        });

        if (this.myinterval !== -1) {
            clearInterval(this.myinterval);
        }
        this.myinterval = window.setInterval(this.updateStatus, 1000);
    }

    /**
     * This interval function reloads the current status of reindexing from backend
     */
    updateStatus = (): void => {
        callAPI(APINode.Settings, {action: 'getStatusMessage'}, (result: SettingsTypes.getStatusMessageType) => {
            this.setState({
                // insert a string for each line
                text: [...result.Messages, ...this.state.text]
            });
            // todo 2020-07-4: scroll to bottom of div here
            if (!result.ContentAvailable) {
                // clear refresh interval if no content available
                clearInterval(this.myinterval);

                this.setState({startbtnDisabled: false});
            }
        });
    };

    /**
     * send request to cleanup db gravity
     */
    cleanupGravity(): void {
        callAPI(APINode.Settings, {action: 'cleanupGravity'}, (result) => {
            this.setState({
                text: ['successfully cleaned up gravity!']
            });
        });
    }
}

export default MovieSettings;
