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
let callQue: (()=>void)[] = []
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
                expireSeconds = new Date().getTime() + result.expires_in;
                // call all pending handlers
                callQue.map(func => {
                    return func();
                })
                // reset pending que
                callQue = []
                // release flag to be able to start new refresh
                refreshInProcess = false;
            }));
}

function checkAPITokenValid(callback: () => void): void {
    // check if token is valid and set
    if (apiToken === '' || expireSeconds <= new Date().getTime()) {
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
                           errorcallback: (_: string) => void = (_: string): void => { }): void {
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
