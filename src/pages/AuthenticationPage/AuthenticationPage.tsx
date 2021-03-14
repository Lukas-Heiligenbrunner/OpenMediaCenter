import React from 'react';
import {Button} from '../../elements/GPElements/Button';
import style from './AuthenticationPage.module.css';

interface state {
    pwdText: string;
}

interface Props {
    submit: (password: string) => void;
}

class AuthenticationPage extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {
            pwdText: ''
        };
    }

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
                    </div>
                    <div>
                        <Button
                            title='Submit'
                            onClick={(): void => {
                                this.props.submit(this.state.pwdText);
                            }}
                        />
                    </div>
                </div>
            </>
        );
    }
}

export default AuthenticationPage;
