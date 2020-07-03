import React from "react";
import {Form, Col, Button} from "react-bootstrap";
import "./GeneralSettings.css"

class GeneralSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tvshowsupport: false,
            videopath: "",
            tvshowpath: ""
        };
    }

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadGeneralSettings');

        fetch('/api/settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    // todo 2020-07-3: set state here
                    // todo 2020-07-4: php and test code
                }));
    }

    render() {
        return (
            <>
                <div className='GeneralForm'>
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        this.saveSettings();
                    }}>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Video Path</Form.Label>
                                <Form.Control type="text" placeholder="/var/www/html/video"/>
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>TV Show Path</Form.Label>
                                <Form.Control type='text' placeholder="/var/www/html/tvshow"/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Enable Password support"
                            onChange={() => {
                                this.setState({tvshowsupport: !this.state.tvshowsupport})
                            }}
                        />

                        {this.state.tvshowsupport ?
                            <Form.Group controlId="passwordfield">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="**********"/>
                            </Form.Group> : null
                        }


                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </>
        );
    }

    saveSettings() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'saveGeneralSettings');

        fetch('/api/settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    // todo 2020-07-4: settings result here
                }));
    }
}

export default GeneralSettings;