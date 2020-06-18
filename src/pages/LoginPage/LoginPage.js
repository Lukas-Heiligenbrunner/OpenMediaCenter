import React from "react";
import {Form} from "react-bootstrap";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.props = props;
    }

    render() {
        return (
            <>
                <div className='pageheader'>
                    <span className='pageheadertitle'>Login Page</span>
                    <span className='pageheadersubtitle'>type correct password!</span>
                    <hr/>
                </div>
                <div style={{marginLeft: "35%", width: "400px", marginTop: "100px"}}>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control id='passfield' type="password" placeholder="Enter Password" onChange={(v) => {
                            this.password = v.target.value
                        }}/>
                        <Form.Text className="text-muted">
                            You can disable/enable this feature on settingspage.
                        </Form.Text>
                        <hr/>
                        <button className='btn btn-success' type='submit' onClick={() => this.checkPassword()}>Submit
                        </button>
                    </Form.Group>
                </div>

            </>
        );
    }

    checkPassword() {
        const updateRequest = new FormData();
        updateRequest.append("action", "checkPassword");
        updateRequest.append("password", this.state.password);

        fetch('/api/settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.correct) {
                        // todo 2020-06-18: call a callback to return back to right page
                    } else {
                        // error popup
                    }
                }))
            .catch(() => {
                console.log("no connection to backend");
            });
    }
}

export default LoginPage;