import React from 'react';

/**
 * global context definitions
 */

export enum LoginState {
    LoggedIn,
    LoggedOut
}

export enum LoginPerm {
    Admin,
    User
}

export interface LoginContextType {
    logout: () => void;
    setPerm: (permission: LoginPerm) => void;
    loginstate: LoginState;
    setLoginState: (state: LoginState) => void;
    permission: LoginPerm;
}

/**
 * A global context providing a way to interact with user login states
 */
export const LoginContext = React.createContext<LoginContextType>({
    setLoginState(): void {},
    setPerm(): void {},
    logout: () => {},
    loginstate: LoginState.LoggedOut,
    permission: LoginPerm.User
});
