import React from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import style from './GeneralSettings.module.css';
import GlobalInfos from '../../utils/GlobalInfos';
import InfoHeaderItem from '../../elements/InfoHeaderItem/InfoHeaderItem';
import {faArchive, faBalanceScaleLeft, faRulerVertical} from '@fortawesome/free-solid-svg-icons';
import {faAddressCard} from '@fortawesome/free-regular-svg-icons';
import {version} from '../../../package.json';
import {callAPI} from '../../utils/Api';

/**
 * Component for Generalsettings tag on Settingspage
 * handles general settings of mediacenter which concerns to all pages
 */
class GeneralSettings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordsupport: false,
            tmdbsupport: null,

            videopath: '',
            tvshowpath: '',
            mediacentername: '',
            password: '',

            videonr: null,
            dbsize: null,
            difftagnr: null,
            tagsadded: null
        };
    }

    componentDidMount() {
        this.loadSettings();
    }

    render() {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <>
                <div className={style.infoheader}>
                    <InfoHeaderItem backColor='lightblue'
                                    text={this.state.videonr}
                                    subtext='Videos in Gravity'
                                    icon={faArchive}/>
                    <InfoHeaderItem backColor='yellow'
                                    text={this.state.dbsize !== undefined ? this.state.dbsize + ' MB' : undefined}
                                    subtext='Database size'
                                    icon={faRulerVertical}/>
                    <InfoHeaderItem backColor='green'
                                    text={this.state.difftagnr}
                                    subtext='different Tags'
                                    icon={faAddressCard}/>
                    <InfoHeaderItem backColor='orange'
                                    text={this.state.tagsadded}
                                    subtext='tags added'
                                    icon={faBalanceScaleLeft}/>
                </div>
                <div className={style.GeneralForm + ' ' + themeStyle.subtextcolor}>
                    <Form data-testid='mainformsettings' onSubmit={(e) => {
                        e.preventDefault();
                        this.saveSettings();
                    }}>
                        <Form.Row>
                            <Form.Group as={Col} data-testid='videpathform'>
                                <Form.Label>Video Path</Form.Label>
                                <Form.Control type='text' placeholder='/var/www/html/video' value={this.state.videopath}
                                              onChange={(ee) => this.setState({videopath: ee.target.value})}/>
                            </Form.Group>

                            <Form.Group as={Col} data-testid='tvshowpath'>
                                <Form.Label>TV Show Path</Form.Label>
                                <Form.Control type='text' placeholder='/var/www/html/tvshow'
                                              value={this.state.tvshowpath}
                                              onChange={(e) => this.setState({tvshowpath: e.target.value})}/>
                            </Form.Group>
                        </Form.Row>

                        <Form.Check
                            type='switch'
                            id='custom-switch'
                            data-testid='passwordswitch'
                            label='Enable Password support'
                            checked={this.state.passwordsupport}
                            onChange={() => {
                                this.setState({passwordsupport: !this.state.passwordsupport});
                            }}
                        />

                        {this.state.passwordsupport ?
                            <Form.Group data-testid='passwordfield'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' placeholder='**********' value={this.state.password}
                                              onChange={(e) => this.setState({password: e.target.value})}/>
                            </Form.Group> : null
                        }

                        <Form.Check
                            type='switch'
                            id='custom-switch-2'
                            data-testid='tmdb-switch'
                            label='Enable TMDB video grabbing support'
                            checked={this.state.tmdbsupport}
                            onChange={() => {
                                this.setState({tmdbsupport: !this.state.tmdbsupport});
                            }}
                        />

                        <Form.Check
                            type='switch'
                            id='custom-switch-3'
                            data-testid='darktheme-switch'
                            label='Enable Dark-Theme'
                            checked={GlobalInfos.isDarkTheme()}
                            onChange={() => {
                                GlobalInfos.enableDarkTheme(!GlobalInfos.isDarkTheme());
                                this.forceUpdate();
                                // todo initiate rerender
                            }}
                        />

                        <Form.Group className={style.mediacenternameform} data-testid='nameform'>
                            <Form.Label>The name of the Mediacenter</Form.Label>
                            <Form.Control type='text' placeholder='Mediacentername' value={this.state.mediacentername}
                                          onChange={(e) => this.setState({mediacentername: e.target.value})}/>
                        </Form.Group>

                        <Button variant='primary' type='submit'>
                            Submit
                        </Button>
                    </Form>
                </div>
                <div className={style.footer}>
                    Version: {version}
                </div>
            </>
        );
    }

    /**
     * inital load of already specified settings from backend
     */
    loadSettings() {
        callAPI('settings.php', {action: 'loadGeneralSettings'}, (result) => {
            this.setState({
                videopath: result.video_path,
                tvshowpath: result.episode_path,
                mediacentername: result.mediacenter_name,
                password: result.password,
                passwordsupport: result.passwordEnabled,
                tmdbsupport: result.TMDB_grabbing,

                videonr: result.videonr,
                dbsize: result.dbsize,
                difftagnr: result.difftagnr,
                tagsadded: result.tagsadded
            });
        });
    }

    /**
     * save the selected and typed settings to the backend
     */
    saveSettings() {
        callAPI('settings.php', {
            action: 'saveGeneralSettings',
            password: this.state.passwordsupport ? this.state.password : '-1',
            videopath: this.state.videopath,
            tvshowpath: this.state.tvshowpath,
            mediacentername: this.state.mediacentername,
            tmdbsupport: this.state.tmdbsupport,
            darkmodeenabled: GlobalInfos.isDarkTheme().toString()
        }, (result) => {
            if (result.success) {
                console.log('successfully saved settings');
                // todo 2020-07-10: popup success
            } else {
                console.log('failed to save settings');
                // todo 2020-07-10: popup error
            }
        });
    }
}

export default GeneralSettings;
