import React from "react";

class MovieSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: []
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
                <button className='reindexbtn btn btn-success' onClick={() => {
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
        console.log("starting");
        const updateRequest = new FormData();
        // fetch all videos available
        fetch('/api/extractvideopreviews.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
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
                        this.setState({
                            text: [...result.message.split("\n"),
                                ...this.state.text]
                        });
                    } else {
                        clearInterval(this.myinterval);
                    }
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    };
}

export default MovieSettings;