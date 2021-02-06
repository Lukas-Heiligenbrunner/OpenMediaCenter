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

    [_: string]: string | number | boolean
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with json reply from backend
 * @param errorcallback a optional callback if an error occured
 */
export function callAPI<T>(apinode: APINode, fd: ApiBaseRequest, callback: (_: T) => void, errorcallback: (_: string) => void = (_: string): void => {}): void {
    fetch(getAPIDomain() + apinode, {method: 'POST', body: JSON.stringify(fd)})
        .then((response) => response.json()
            .then((result) => {
                callback(result);
            })).catch(reason => errorcallback(reason));
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with PLAIN text reply from backend
 */
export function callAPIPlain(apinode: APINode, fd: ApiBaseRequest, callback: (_: string) => void): void {
    fetch(getAPIDomain() + apinode, {method: 'POST', body: JSON.stringify(fd)})
        .then((response) => response.text()
            .then((result) => {
                callback(result);
            }));

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
