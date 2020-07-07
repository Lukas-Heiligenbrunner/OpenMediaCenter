import React from "react";
import "./MovieSettings.css"

class MovieSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: []
        };

        this.startbtn = React.createRef();
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
                <button ref={this.startbtn} className='reindexbtn btn btn-success' onClick={() => {
                    this.startReindex()
                }}>Reindex Movies
                </button>
                <div className='indextextarea'>{this.state.text.map(m => (
                    <div className='textarea-element'>{m}</div>
                ))}</div>
            </>
        );
    }

    startReindex() {
        // clear output text before start
        this.setState({text: []});

        const btn = this.startbtn.current;
        btn.disabled = true;

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
        console.log("sent");
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

                        const btn = this.startbtn.current;
                        btn.disabled = false;
                    }
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    };
}

export default MovieSettings;