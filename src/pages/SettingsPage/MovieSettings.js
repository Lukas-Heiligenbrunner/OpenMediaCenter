import React from 'react';
import style from './MovieSettings.module.css';
import {callAPI} from '../../utils/Api';

/**
 * Component for MovieSettings on Settingspage
 * handles settings concerning to movies in general
 */
class MovieSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: [],
            startbtnDisabled: false
        };
    }

    componentDidMount() {
        this.myinterval = setInterval(this.updateStatus, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.myinterval);
    }

    render() {
        return (
            <>
                <button disabled={this.state.startbtnDisabled}
                        className='btn btn-success'
                        onClick={() => {this.startReindex();}}>Reindex Movie
                </button>
                <button className='btn btn-warning'
                        onClick={() => {this.cleanupGravity();}}>Cleanup Gravity
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
    startReindex() {
        // clear output text before start
        this.setState({text: []});

        this.setState({startbtnDisabled: true});

        console.log('starting');

        callAPI('settings.php', {action: 'startReindex'}, (result) => {
            console.log(result);
            if (result.success) {
                console.log('started successfully');
            } else {
                console.log('error, reindex already running');
                this.setState({startbtnDisabled: true});
            }
        });

        if (this.myinterval) {
            clearInterval(this.myinterval);
        }
        this.myinterval = setInterval(this.updateStatus, 1000);
    }

    /**
     * This interval function reloads the current status of reindexing from backend
     */
    updateStatus = () => {
        callAPI('settings.php', {action: 'getStatusMessage'}, (result) => {
            if (result.contentAvailable === true) {
                console.log(result);
                // todo 2020-07-4: scroll to bottom of div here
                this.setState({
                    // insert a string for each line
                    text: [...result.message.split('\n'),
                        ...this.state.text]
                });
            } else {
                // clear refresh interval if no content available
                clearInterval(this.myinterval);

                this.setState({startbtnDisabled: false});
            }
        });
    };

    /**
     * send request to cleanup db gravity
     */
    cleanupGravity() {
        callAPI('settings.php', {action: 'cleanupGravity'}, (result) => {
            this.setState({
                text: ['successfully cleaned up gravity!']
            });
        });
    }
}

export default MovieSettings;
