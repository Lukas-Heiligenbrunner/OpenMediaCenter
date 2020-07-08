import React from "react";
import style from "./MovieSettings.module.css"

class MovieSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: [],
            startbtnDisabled: false
        };
    }

    componentDidMount() {
        if (this.myinterval) {
            clearInterval(this.myinterval);
        }
        this.myinterval = setInterval(this.updateStatus, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.myinterval);
    }

    render() {
        return (
            <>
                <button disabled={this.state.startbtnDisabled} className='reindexbtn btn btn-success' onClick={() => {
                    this.startReindex()
                }}>Reindex Movies
                </button>
                <div className={style.indextextarea}>{this.state.text.map(m => (
                    <div className='textarea-element'>{m}</div>
                ))}</div>
            </>
        );
    }

    startReindex() {
        // clear output text before start
        this.setState({text: []});

        this.setState({startbtnDisabled: true});

        console.log("starting");
        const updateRequest = new FormData();
        // fetch all videos available
        fetch('/api/extractvideopreviews.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    // todo 2020-07-4: some kind of start event
                    console.log("returned");
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
        if (this.myinterval) {
            clearInterval(this.myinterval);
        }
        this.myinterval = setInterval(this.updateStatus, 1000);
    }

    updateStatus = () => {
        const updateRequest = new FormData();
        fetch('/api/extractionData.php', {method: 'POST', body: updateRequest})
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
}

export default MovieSettings;
