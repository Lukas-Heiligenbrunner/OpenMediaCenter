import React from 'react';
import {Button, Col, Form} from 'react-bootstrap';
import style from './GeneralSettings.module.css';
import GlobalInfos from '../../utils/GlobalInfos';
import InfoHeaderItem from '../../elements/InfoHeaderItem/InfoHeaderItem';
import {faArchive, faBalanceScaleLeft, faRulerVertical} from '@fortawesome/free-solid-svg-icons';
import {faAddressCard} from '@fortawesome/free-regular-svg-icons';
import {version} from '../../../package.json';
import {APINode, callAPI} from '../../utils/Api';
import {SettingsTypes} from '../../types/ApiTypes';
import {GeneralSuccess} from '../../types/GeneralTypes';

interface state {
    generalSettings: SettingsTypes.SettingsType;
    sizes: SettingsTypes.SizesType;
}

interface Props {}

/**
 * Component for Generalsettings tag on Settingspage
 * handles general settings of mediacenter which concerns to all pages
 */
class GeneralSettings extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {
            generalSettings: {
                DarkMode: true,
                EpisodePath: '',
                MediacenterName: '',
                Password: '',
                PasswordEnabled: false,
                TMDBGrabbing: false,
                VideoPath: '',
                RandomNR: 3
            },
            sizes: {
                DBSize: 0,
                DifferentTags: 0,
                TagsAdded: 0,
                VideoNr: 0
            }
        };
    }

    componentDidMount(): void {
        this.loadSettings();
    }

    render(): JSX.Element {
        const themeStyle = GlobalInfos.getThemeStyle();
        return (
            <>
                <div className={style.infoheader}>
                    <InfoHeaderItem
                        backColor='lightblue'
                        text={this.state.sizes.VideoNr}
                        subtext='Videos in Gravity'
                        icon={faArchive}
                    />
                    <InfoHeaderItem
                        backColor='yellow'
                        text={this.state.sizes.DBSize + ' MB'}
                        subtext='Database size'
                        icon={faRulerVertical}
                    />
                    <InfoHeaderItem
                        backColor='green'
                        text={this.state.sizes.DifferentTags}
                        subtext='different Tags'
                        icon={faAddressCard}
                    />
                    <InfoHeaderItem
                        backColor='orange'
                        text={this.state.sizes.TagsAdded}
                        subtext='tags added'
                        icon={faBalanceScaleLeft}
                    />
                </div>
                <div className={style.GeneralForm + ' ' + themeStyle.subtextcolor}>
                    <Form
                        data-testid='mainformsettings'
                        onSubmit={(e): void => {
                            e.preventDefault();
                            this.saveSettings();
                        }}>
                        <Form.Row>
                            <Form.Group as={Col} data-testid='videpathform'>
                                <Form.Label>Video Path</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='/var/www/html/video'
                                    value={this.state.generalSettings.VideoPath}
                                    onChange={(ee): void =>
                                        this.setState({
                                            generalSettings: {
                                                ...this.state.generalSettings,
                                                VideoPath: ee.target.value
                                            }
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group as={Col} data-testid='tvshowpath'>
                                <Form.Label>TV Show Path</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='/var/www/html/tvshow'
                                    value={this.state.generalSettings.EpisodePath}
                                    onChange={(e): void =>
                                        this.setState({
                                            generalSettings: {
                                                ...this.state.generalSettings,
                                                EpisodePath: e.target.value
                                            }
                                        })
                                    }
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Check
                            type='switch'
                            id='custom-switch'
                            data-testid='passwordswitch'
                            label='Enable Password support'
                            checked={this.state.generalSettings.PasswordEnabled}
                            onChange={(): void => {
                                this.setState({
                                    generalSettings: {
                                        ...this.state.generalSettings,
                                        PasswordEnabled: !this.state.generalSettings.PasswordEnabled
                                    }
                                });
                            }}
                        />

                        {this.state.generalSettings.PasswordEnabled ? (
                            <Form.Group data-testid='passwordfield'>
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    placeholder='**********'
                                    value={this.state.generalSettings.Password}
                                    onChange={(e): void =>
                                        this.setState({
                                            generalSettings: {
                                                ...this.state.generalSettings,
                                                Password: e.target.value
                                            }
                                        })
                                    }
                                />
                            </Form.Group>
                        ) : null}

                        <Form.Check
                            type='switch'
                            id='custom-switch-2'
                            data-testid='tmdb-switch'
                            label='Enable TMDB video grabbing support'
                            checked={this.state.generalSettings.TMDBGrabbing}
                            onChange={(): void => {
                                this.setState({
                                    generalSettings: {
                                        ...this.state.generalSettings,
                                        TMDBGrabbing: !this.state.generalSettings.TMDBGrabbing
                                    }
                                });
                            }}
                        />

                        <Form.Check
                            type='switch'
                            id='custom-switch-3'
                            data-testid='darktheme-switch'
                            label='Enable Dark-Theme'
                            checked={GlobalInfos.isDarkTheme()}
                            onChange={(): void => {
                                GlobalInfos.enableDarkTheme(!GlobalInfos.isDarkTheme());
                            }}
                        />

                        <Form.Group className={style.mediacenternameform} data-testid='nameform'>
                            <Form.Label>The name of the Mediacenter</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Mediacentername'
                                value={this.state.generalSettings.MediacenterName}
                                onChange={(e): void =>
                                    this.setState({
                                        generalSettings: {
                                            ...this.state.generalSettings,
                                            MediacenterName: e.target.value
                                        }
                                    })
                                }
                            />
                        </Form.Group>

                        <Form.Group className={style.mediacenternameform} data-testid='randnrform'>
                            <Form.Label>Number of random videos on Random page</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='2'
                                value={this.state.generalSettings.RandomNR}
                                onChange={(e): void =>
                                    this.setState({
                                        generalSettings: {
                                            ...this.state.generalSettings,
                                            RandomNR: parseInt(e.target.value, 10)
                                        }
                                    })
                                }
                            />
                        </Form.Group>

                        <Button variant='primary' type='submit'>
                            Submit
                        </Button>
                    </Form>
                </div>
                <div className={style.footer}>Version: {version}</div>
            </>
        );
    }

    /**
     * inital load of already specified settings from backend
     */
    loadSettings(): void {
        interface SettingsResponseType {
            Settings: SettingsTypes.SettingsType;
            Sizes: SettingsTypes.SizesType;
        }

        callAPI(APINode.Settings, {action: 'loadGeneralSettings'}, (result: SettingsResponseType) => {
            this.setState({
                generalSettings: result.Settings,
                sizes: result.Sizes
            });
        });
    }

    /**
     * save the selected and typed settings to the backend
     */
    saveSettings(): void {
        let settings = this.state.generalSettings;
        if (!this.state.generalSettings.PasswordEnabled) {
            settings.Password = '-1';
        }
        settings.DarkMode = GlobalInfos.isDarkTheme();

        console.log(settings);
        callAPI(
            APINode.Settings,
            {
                action: 'saveGeneralSettings',
                ...settings
            },
            (result: GeneralSuccess) => {
                if (result.result) {
                    console.log('successfully saved settings');
                    // todo 2020-07-10: popup success
                } else {
                    console.log('failed to save settings');
                    // todo 2020-07-10: popup error
                }
            }
        );
    }
}

export default GeneralSettings;
