import GlobalInfos from './GlobalInfos';
import {token} from './TokenHandler';

const APIPREFIX: string = '/api/';

/**
 * interface how an api request should look like
 */
interface ApiBaseRequest {
    action: string | number;

    [_: string]: string | number | boolean | object;
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
        generalAPICall<T>(apinode, fd, callback, errorcallback, false, true, mytoken);
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
    generalAPICall(apinode, fd, callback, errorcallback, true, true, '');
}

/**
 * A backend api call
 * @param apinode which api backend handler to call
 * @param fd the object to send to backend
 * @param callback the callback with PLAIN text reply from backend
 */
export function callAPIPlain(apinode: APINode, fd: ApiBaseRequest, callback: (_: string) => void): void {
    token.checkAPITokenValid((mytoken) => {
        generalAPICall(apinode, fd, callback, () => {}, false, false, mytoken);
    });
}

function generalAPICall<T>(
    apinode: APINode,
    fd: ApiBaseRequest,
    callback: (_: T) => void,
    errorcallback: (_: string) => void = (_: string): void => {},
    unsafe: boolean,
    json: boolean,
    mytoken: string
): void {
    (async function (): Promise<void> {
        const response = await fetch(APIPREFIX + apinode, {
            method: 'POST',
            body: JSON.stringify(fd),
            headers: new Headers({
                'Content-Type': json ? 'application/json' : 'text/plain',
                ...(!unsafe && {Authorization: 'Bearer ' + mytoken})
            })
        });

        if (response.status === 200) {
            // success
            try {
                // decode json or text
                const data = json ? await response.json() : await response.text();
                callback(data);
            } catch (e) {
                errorcallback(e);
            }
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
            if (errorcallback) {
                errorcallback(response.statusText);
            }
        }
    })();
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
