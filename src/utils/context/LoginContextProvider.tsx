import {LoginContext, LoginPerm, LoginState} from './LoginContext';
import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router';
import {cookie} from './Cookie';
import {APINode, callAPI} from '../Api';
import {SettingsTypes} from '../../types/ApiTypes';
import GlobalInfos from '../GlobalInfos';
import {FeatureContext} from './FeatureContext';

export const LoginContextProvider: FunctionComponent = (props): JSX.Element => {
    let initialLoginState = LoginState.LoggedIn;
    let initialUserPerm = LoginPerm.User;

    const features = useContext(FeatureContext);

    const t = cookie.Load();
    // we are already logged in so we can set the token and redirect to dashboard
    if (t !== null) {
        initialLoginState = LoginState.LoggedIn;
    }

    const [loginState, setLoginState] = useState<LoginState>(initialLoginState);
    const [permission, setPermission] = useState<LoginPerm>(initialUserPerm);

    useEffect(() => {
        // this is the first api call so if it fails we know there is no connection to backend
        callAPI(
            APINode.Settings,
            {action: 'loadInitialData'},
            (result: SettingsTypes.initialApiCallData) => {
                // set theme
                GlobalInfos.enableDarkTheme(result.DarkMode);

                GlobalInfos.setVideoPaths(result.VideoPath, result.TVShowPath);

                features.setTVShowEnabled(result.TVShowEnabled);
                features.setVideosFullyDeleteable(result.FullDeleteEnabled);

                // this.setState({
                //     mediacentername: result.MediacenterName
                // });
                // set tab title to received mediacenter name
                document.title = result.MediacenterName;

                setLoginState(LoginState.LoggedIn);
            },
            (_) => {
                setLoginState(LoginState.LoggedOut);
            }
        );
    }, [features, loginState]);

    const hist = useHistory();
    const loc = useLocation();

    // trigger redirect on loginstate change
    useEffect(() => {
        if (loginState === LoginState.LoggedIn) {
            // if we arent already in dashboard tree we want to redirect to default dashboard page
            console.log('redirecting to dashboard' + loc.pathname);
            if (!loc.pathname.startsWith('/media')) {
                hist.replace('/media');
            }
        } else {
            if (!loc.pathname.startsWith('/login')) {
                hist.replace('/login');
            }
        }
    }, [hist, loc.pathname, loginState]);

    const value = {
        logout: (): void => {
            setLoginState(LoginState.LoggedOut);
            cookie.Delete();
        },
        setPerm: (perm: LoginPerm): void => {
            setPermission(perm);
        },
        setLoginState: (state: LoginState): void => {
            setLoginState(state);
        },
        loginstate: loginState,
        permission: permission
    };

    return <LoginContext.Provider value={value}>{props.children}</LoginContext.Provider>;
};

interface Props {
    perm: LoginPerm;
}

/**
 * Wrapper element to render children only if permissions are sufficient
 */
export const AuthorizedContext: FunctionComponent<Props> = (props): JSX.Element => {
    const loginctx = useContext(LoginContext);

    if (loginctx.permission <= props.perm) {
        return props.children as JSX.Element;
    } else {
        return <></>;
    }
};
