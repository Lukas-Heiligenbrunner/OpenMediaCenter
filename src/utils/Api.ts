let customBackendURL: string;

/**
 * get the domain of the api backend
 * @return string domain of backend http://x.x.x.x/bla
 */
export function getBackendDomain(): string {
    let userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf(' electron/') > -1) {
        // Electron-specific code - force a custom backendurl
        return (customBackendURL);
    } else {
        // use custom only if defined
        if (customBackendURL) {
            return (customBackendURL);
        } else {
            return (window.location.origin);
        }
    }
}

/**
 * set a custom backend domain
 * @param domain a url in format [http://x.x.x.x/somanode]
 */
export function setCustomBackendDomain(domain: string): void {
    customBackendURL = domain;
}

/**
 * a helper function to get the api path
 */
function getAPIDomain(): string {
    return getBackendDomain() + '/api/';
}

/**
 * interface how an api request should look like
 */
interface ApiBaseRequest {
    action: string | number,

    [_: string]: string | number | boolean | object
}

// store api token - empty if not set
let apiToken = ''

// a callback que to be called after api token refresh
let callQue: (() => void)[] = []
// flag to check wheter a api refresh is currently pending
let refreshInProcess = false;
// store the expire seconds of token
let expireSeconds = -1;

interface APIToken {
    access_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
}

/**
 * refresh the api token or use that one in cookie if still valid
 * @param callback to be called after successful refresh
 */
export function refreshAPIToken(callback: () => void): void {
    callQue.push(callback);

    // check if already is a token refresh is in process
    if (refreshInProcess) {
        // if yes return
        return;
    } else {
        // if not set flat
        refreshInProcess = true;
    }

    // check if a cookie with token is available
    const token = getTokenCookie();
    if(token !== null){
        // check if token is at least valid for the next minute
        if(token.expire > (new Date().getTime() / 1000) + 60){
            apiToken = token.token;
            expireSeconds = token.expire;
            callback();
            console.log("token still valid...")
            callFuncQue();
            return;
        }
    }

    const formData = new FormData();
    formData.append("grant_type", "client_credentials");
    formData.append("client_id", "openmediacenter");
    formData.append("client_secret", 'openmediacenter');
    formData.append("scope", 'all');


    fetch(getBackendDomain() + '/token', {method: 'POST', body: formData})
        .then((response) => response.json()
            .then((result: APIToken) => {
                console.log(result)
                // set api token
                apiToken = result.access_token;
                // set expire time
                expireSeconds = (new Date().getTime() / 1000) + result.expires_in;
                setTokenCookie(apiToken, expireSeconds);
                // call all handlers and release flag
                callFuncQue();
            }));
}

/**
 * call all qued callbacks
 */
function callFuncQue(): void {
    // call all pending handlers
    callQue.map(func => {
        return func();
    })
    // reset pending que
    callQue = []
    // release flag to be able to start new refresh
    refreshInProcess = false;
}

/**
 * set the cookie for the currently gotten token
 * @param token token string
 * @param validSec second time when the token will be invalid
 */
function setTokenCookie(token: string, validSec: number): void {
    let d = new Date();
    d.setTime(validSec * 1000);
    console.log("token set" + d.toUTCString())
    let expires = "expires=" + d.toUTCString();
    document.cookie = "token=" + token + ";" + expires + ";path=/";
    document.cookie = "token_expire=" + validSec + ";" + expires + ";path=/";
}

/**
 * get all required cookies for the token
 */
function getTokenCookie(): {token: string, expire: number } | null {
    const token = decodeCookie('token');
    const expireInString = decodeCookie('token_expire');
    const expireIn = parseInt(expireInString, 10) | 0;

    if(expireIn !== 0 && token !== ''){
        return {token: token, expire: expireIn};
    }else{
        return null
    }
}

/**
 * decode a simple cookie with key specified
 * @param key cookie key
 */
function decodeCookie(key: string): string {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

/**
 * check if api token is valid -- if not request new one
 * when finished call callback
 * @param callback function to be called afterwards
 */
function checkAPITokenValid(callback: () => void): void {
    // check if token is valid and set
    if (apiToken === '' || expireSeconds <= new Date().getTime() / 1000) {
        refreshAPIToken(() => {
            callback()
        })
    } else {
        callback()
    }
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with json reply from backend
 * @param errorcallback a optional callback if an error occured
 */
export function callAPI<T>(apinode: APINode,
                           fd: ApiBaseRequest,
                           callback: (_: T) => void,
                           errorcallback: (_: string) => void = (_: string): void => {
                           }): void {
    checkAPITokenValid(() => {
        fetch(getAPIDomain() + apinode, {
            method: 'POST', body: JSON.stringify(fd), headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiToken,
            }),
        }).then((response) => response.json()
            .then((result: T) => {
                callback(result);
            })).catch(reason => errorcallback(reason));
    })
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with PLAIN text reply from backend
 */
export function callAPIPlain(apinode: APINode, fd: ApiBaseRequest, callback: (_: string) => void): void {
    checkAPITokenValid(() => {
        fetch(getAPIDomain() + apinode, {
            method: 'POST', body: JSON.stringify(fd), headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiToken,
            })
        })
            .then((response) => response.text()
                .then((result) => {
                    callback(result);
                }));
    });
}

/**
 * API nodes definitions
 */
export enum APINode {
    Settings = 'settings',
    Tags = 'tags',
    Actor = 'actor',
    Video = 'video'
}
