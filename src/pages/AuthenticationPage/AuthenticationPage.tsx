import React from 'react';
import {Button} from '../../elements/GPElements/Button';
import style from './AuthenticationPage.module.css';
import {addKeyHandler, removeKeyHandler} from '../../utils/ShortkeyHandler';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {LoginContext, LoginState} from '../../utils/context/LoginContext';
import {APINode, callApiUnsafe} from '../../utils/Api';
import {cookie, Token} from '../../utils/context/Cookie';

interface state {
    pwdText: string;
    wrongPWDInfo: boolean;
}

interface Props {
    onSuccessLogin: () => void;
}

class AuthenticationPage extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {
            pwdText: '',
            wrongPWDInfo: false
        };

        this.keypress = this.keypress.bind(this);
        this.authenticate = this.authenticate.bind(this);
    }

    componentDidMount(): void {
        addKeyHandler(this.keypress);
    }

    componentWillUnmount(): void {
        removeKeyHandler(this.keypress);
    }

    static contextType = LoginContext;

    render(): JSX.Element {
        return (
            <>
                <div className={style.openmediacenterlabel}>OpenMediaCenter</div>
                <div className={style.main}>
                    <div className={style.loginText}>Login</div>
                    <div>
                        <input
                            className={style.input}
                            placeholder='Password'
                            type='password'
                            onChange={(ch): void => this.setState({pwdText: ch.target.value})}
                            value={this.state.pwdText}
                        />
                        {this.state.wrongPWDInfo ? (
                            <div>
                                <FontAwesomeIcon
                                    style={{
                                        color: 'red',
                                        marginRight: '7px'
                                    }}
                                    icon={faTimes}
                                    size='1x'
                                />
                                wrong password!
                            </div>
                        ) : null}
                    </div>
                    <div className={style.submitbtn}>
                        <Button title='Submit' onClick={this.authenticate} />
                    </div>
                </div>
            </>
        );
    }

    /**
     * request a new token and check if pwd was valid
     */
    authenticate(): void {
        callApiUnsafe(
            APINode.Login,
            {action: 'login', Password: this.state.pwdText},
            (r: Token) => {
                cookie.Store(r);

                this.context.setLoginState(LoginState.LoggedIn);
            },
            (e) => {
                console.log(e);
            }
        );
    }

    /**
     * key event handling
     * @param event keyevent
     */
    keypress(event: KeyboardEvent): void {
        // hide if escape is pressed
        if (event.key === 'Enter') {
            // call submit
            this.authenticate();
        }
    }
}

export default AuthenticationPage;
