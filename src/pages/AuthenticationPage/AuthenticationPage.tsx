import React from "react";
import {Button} from "../../elements/GPElements/Button";

interface state {
    pwdText: string
}

interface props {
    submit: (password: string) => void
}

class AuthenticationPage extends React.Component<props, state> {
    constructor(props: props) {
        super(props);

        this.state = {
            pwdText: ''
        }
    }

    render(): JSX.Element {
        return (
            <>
                <div>Please type in the Password:</div>
                <input placeholder='Password' type='password' onChange={(ch): void => {
                    this.setState({pwdText: ch.target.value});
                }} value={this.state.pwdText}/>
                <Button title='Submit' onClick={(): void => {
                    this.props.submit(this.state.pwdText);
                }}></Button>
            </>
        );
    }
}

export default AuthenticationPage;