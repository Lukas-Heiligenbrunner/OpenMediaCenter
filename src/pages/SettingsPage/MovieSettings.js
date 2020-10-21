import React from "react";
import style from "./MovieSettings.module.css"

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
                        onClick={() => {this.startReindex()}}>Reindex Movie
                </button>
                <button className='btn btn-warning'
                        onClick={() => {this.cleanupGravity()}}>Cleanup Gravity
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

        console.log("starting");
        const request = new FormData();
        request.append("action", "startReindex");
        // fetch all videos available
        fetch('/api/settings.php', {method: 'POST', body: request})
            .then((response) => response.json()
                .then((result) => {
                    console.log(result);
                    if (result.success) {
                        console.log("started successfully");
                    } else {
                        console.log("error, reindex already running");
                        this.setState({startbtnDisabled: true});
                    }
                }))
            .catch(() => {
                console.log("no connection to backend");
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
        const request = new FormData();
        request.append("action", "getStatusMessage");

        fetch('/api/settings.php', {method: 'POST', body: request})
            .then((response) => response.json()
                .then((result) => {
                    if (result.contentAvailable === true) {
                        console.log(result);
                        // todo 2020-07-4: scroll to bottom of div here
                        this.setState({
                            // insert a string for each line
                            text: [...result.message.split("\n"),
                                ...this.state.text]
                        });
                    } else {
                        // clear refresh interval if no content available
                        clearInterval(this.myinterval);

                        this.setState({startbtnDisabled: false});
                    }
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    };

    /**
     * send request to cleanup db gravity
     */
    cleanupGravity() {
        const request = new FormData();
        request.append("action", "cleanupGravity");

        fetch('/api/settings.php', {method: 'POST', body: request})
            .then((response) => response.text()
                .then((result) => {
                    this.setState({
                        text: ['successfully cleaned up gravity!']
                    });
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }
}

export default MovieSettings;
