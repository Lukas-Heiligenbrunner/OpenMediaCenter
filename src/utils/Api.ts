import GlobalInfos from './GlobalInfos';
import {TokenStore} from './TokenStore/TokenStore';

const APIPREFIX: string = '/api/';

/**
 * interface how an api request should look like
 */
interface ApiBaseRequest {
    action: string | number;

    [_: string]: string | number | boolean | object;
}

export namespace token {
    // store api token - empty if not set
    let apiToken = '';

    // a callback que to be called after api token refresh
    let callQue: ((error: string) => void)[] = [];
    // flag to check wheter a api refresh is currently pending
    let refreshInProcess = false;
    // store the expire seconds of token
    let expireSeconds = -1;

    let tokenStore: TokenStore;

    export function setTokenStore(ts: TokenStore): void {
        tokenStore = ts;
    }

    /**
     * refresh the api token or use that one in cookie if still valid
     * @param callback to be called after successful refresh
     * @param password
     * @param force
     */
    export function refreshAPIToken(callback: (error: string) => void, force?: boolean, password?: string): void {
        callQue.push(callback);

        // check if already is a token refresh is in process
        if (refreshInProcess) {
            // if yes return
            return;
        } else {
            // if not set flat
            refreshInProcess = true;
        }

        if (apiTokenValid() && !force) {
            console.log('token still valid...');
            callFuncQue('');
            return;
        }

        const formData = new FormData();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_id', 'openmediacenter');
        formData.append('client_secret', password ? password : 'openmediacenter');
        formData.append('scope', 'all');

        interface APIToken {
            error?: string;
            // eslint-disable-next-line camelcase
            access_token: string; // no camel case allowed because of backendlib
            // eslint-disable-next-line camelcase
            expires_in: number; // no camel case allowed because of backendlib
            scope: string;
            // eslint-disable-next-line camelcase
            token_type: string; // no camel case allowed because of backendlib
        }

        fetch('/token', {method: 'POST', body: formData}).then((response) =>
            response.json().then((result: APIToken) => {
                if (result.error) {
                    callFuncQue(result.error);
                    return;
                }
                // set api token
                apiToken = result.access_token;
                // set expire time
                expireSeconds = new Date().getTime() / 1000 + result.expires_in;
                // setTokenCookie(apiToken, expireSeconds);
                tokenStore.setToken({accessToken: apiToken, expireTime: expireSeconds, tokenType: '', scope: ''});
                // call all handlers and release flag
                callFuncQue('');
            })
        );
    }

    export function apiTokenValid(): boolean {
        // check if a cookie with token is available
        // const token = getTokenCookie();
        const tmptoken = tokenStore.loadToken();
        if (tmptoken !== null) {
            // check if token is at least valid for the next minute
            if (tmptoken.expireTime > new Date().getTime() / 1000 + 60) {
                apiToken = tmptoken.accessToken;
                expireSeconds = tmptoken.expireTime;

                return true;
            }
        }
        return false;
    }

    /**
     * call all qued callbacks
     */
    function callFuncQue(error: string): void {
        // call all pending handlers
        callQue.map((func) => {
            return func(error);
        });
        // reset pending que
        callQue = [];
        // release flag to be able to start new refresh
        refreshInProcess = false;
    }

    /**
     * check if api token is valid -- if not request new one
     * when finished call callback
     * @param callback function to be called afterwards
     */
    export function checkAPITokenValid(callback: (mytoken: string) => void): void {
        // check if token is valid and set
        if (apiToken === '' || expireSeconds <= new Date().getTime() / 1000) {
            console.log('token not valid...');
            refreshAPIToken(() => {
                callback(apiToken);
            });
        } else {
            callback(apiToken);
        }
    }
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with json reply from backend
 * @param errorcallback a optional callback if an error occured
 */
export function callAPI<T>(
    apinode: APINode,
    fd: ApiBaseRequest,
    callback: (_: T) => void,
    errorcallback: (_: string) => void = (_: string): void => {}
): void {
    token.checkAPITokenValid((mytoken) => {
        fetch(APIPREFIX + apinode, {
            method: 'POST',
            body: JSON.stringify(fd),
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + mytoken
            })
        })
            .then((response) => {
                if (response.status === 200) {
                    // success
                    response.json().then((result: T) => {
                        callback(result);
                    });
                } else if (response.status === 400) {
                    // Bad Request --> invalid token
                    console.log('loading Password page.');
                    // load password page
                    if (GlobalInfos.loadPasswordPage) {
                        GlobalInfos.loadPasswordPage(() => {
                            callAPI(apinode, fd, callback, errorcallback);
                        });
                    }
                } else {
                    console.log('Error: ' + response.statusText);
                }
            })
            .catch((reason) => errorcallback(reason));
    });
}

/**
 * make a public unsafe api call (without token) -- use as rare as possible only for initialization (eg. check if pwd is neccessary)
 * @param apinode
 * @param fd
 * @param callback
 * @param errorcallback
 */
export function callApiUnsafe<T>(
    apinode: APINode,
    fd: ApiBaseRequest,
    callback: (_: T) => void,
    errorcallback?: (_: string) => void
): void {
    fetch(APIPREFIX + apinode, {method: 'POST', body: JSON.stringify(fd)})
        .then((response) => {
            if (response.status !== 200) {
                console.log('Error: ' + response.statusText);
                // todo place error popup here
            } else {
                response.json().then((result: T) => {
                    callback(result);
                });
            }
        })
        .catch((reason) => (errorcallback ? errorcallback(reason) : {}));
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with PLAIN text reply from backend
 */
export function callAPIPlain(apinode: APINode, fd: ApiBaseRequest, callback: (_: string) => void): void {
    token.checkAPITokenValid((mytoken) => {
        fetch(APIPREFIX + apinode, {
            method: 'POST',
            body: JSON.stringify(fd),
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + mytoken
            })
        }).then((response) =>
            response.text().then((result) => {
                callback(result);
            })
        );
    });
}

/**
 * API nodes definitions
 */

// eslint-disable-next-line no-shadow
export enum APINode {
    Settings = 'settings',
    Tags = 'tags',
    Actor = 'actor',
    Video = 'video',
    TVShow = 'tvshow'
}
