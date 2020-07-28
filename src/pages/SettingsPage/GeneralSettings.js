import React from "react";
import {Button, Col, Form} from "react-bootstrap";
import style from "./GeneralSettings.module.css"
import StaticInfos from "../../GlobalInfos";
import darktheme from "../../AppDarkTheme.module.css";
import lighttheme from "../../AppLightTheme.module.css";

class GeneralSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordsupport: false,
            tmdbsupport: null,

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
                    console.log(result);
                    this.setState({
                        videopath: result.video_path,
                        tvshowpath: result.episode_path,
                        mediacentername: result.mediacenter_name,
                        password: result.password,
                        passwordsupport: result.passwordEnabled,
                        tmdbsupport: result.TMDB_grabbing
                    });
                }));
    }

    render() {
        const themeStyle = StaticInfos.isDarkTheme() ? darktheme : lighttheme;
        return (
            <>
                <div className={style.GeneralForm + ' ' + themeStyle.subtextcolor}>
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

                        <Form.Check
                            type="switch"
                            id="custom-switch-2"
                            data-testid='tmdb-switch'
                            label="Enable TMDB video grabbing support"
                            checked={this.state.tmdbsupport}
                            onChange={() => {
                                this.setState({tmdbsupport: !this.state.tmdbsupport})
                            }}
                        />

                        <Form.Check
                            type="switch"
                            id="custom-switch-3"
                            data-testid='darktheme-switch'
                            label="Enable Dark-Theme"
                            checked={StaticInfos.isDarkTheme()}
                            onChange={() => {
                                StaticInfos.enableDarkTheme(!StaticInfos.isDarkTheme());
                                this.forceUpdate();
                                // todo initiate rerender
                            }}
                        />

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
        updateRequest.append("tmdbsupport", this.state.tmdbsupport);

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
