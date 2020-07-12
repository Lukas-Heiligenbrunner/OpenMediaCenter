import React from "react";
import {Button, Col, Form} from "react-bootstrap";
import style from "./GeneralSettings.module.css"

class GeneralSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordsupport: false,

            videopath: "",
            tvshowpath: "",
            mediacentername: "",
            password: ""
        };
    }

    componentDidMount() {
        const updateRequest = new FormData();
        updateRequest.append('action', 'loadGeneralSettings');

        fetch('/api/Settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    this.setState({
                        videopath: result.video_path,
                        tvshowpath: result.episode_path,
                        mediacentername: result.mediacenter_name,
                        password: result.password,
                        passwordsupport: result.passwordEnabled
                    });
                }));
    }

    render() {
        return (
            <>
                <div className={style.GeneralForm}>
                    <Form data-testid='mainformsettings' onSubmit={(e) => {
                        e.preventDefault();
                        this.saveSettings();
                    }}>
                        <Form.Row>
                            <Form.Group as={Col} data-testid="videpathform">
                                <Form.Label>Video Path</Form.Label>
                                <Form.Control type="text" placeholder="/var/www/html/video" value={this.state.videopath}
                                              onChange={(ee) => this.setState({videopath: ee.target.value})}/>
                            </Form.Group>

                            <Form.Group as={Col} data-testid="tvshowpath">
                                <Form.Label>TV Show Path</Form.Label>
                                <Form.Control type='text' placeholder="/var/www/html/tvshow"
                                              value={this.state.tvshowpath}
                                              onChange={(e) => this.setState({tvshowpath: e.target.value})}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            data-testid='passwordswitch'
                            label="Enable Password support"
                            checked={this.state.passwordsupport}
                            onChange={() => {
                                this.setState({passwordsupport: !this.state.passwordsupport})
                            }}
                        />

                        {this.state.passwordsupport ?
                            <Form.Group data-testid="passwordfield">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="**********" value={this.state.password}
                                              onChange={(e) => this.setState({password: e.target.value})}/>
                            </Form.Group> : null
                        }

                        <Form.Group className={style.mediacenternameform} data-testid="nameform">
                            <Form.Label>The name of the Mediacenter</Form.Label>
                            <Form.Control type="text" placeholder="Mediacentername" value={this.state.mediacentername}
                                          onChange={(e) => this.setState({mediacentername: e.target.value})}/>
                        </Form.Group>

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

        updateRequest.append('password', this.state.passwordsupport ? this.state.password : "-1");
        updateRequest.append('videopath', this.state.videopath);
        updateRequest.append('tvshowpath', this.state.tvshowpath);
        updateRequest.append('mediacentername', this.state.mediacentername);

        fetch('/api/Settings.php', {method: 'POST', body: updateRequest})
            .then((response) => response.json()
                .then((result) => {
                    if (result.success) {
                        console.log("successfully saved settings");
                        // todo 2020-07-10: popup success
                    } else {
                        console.log("failed to save settings");
                        // todo 2020-07-10: popup error
                    }
                }));
    }
}

export default GeneralSettings;
