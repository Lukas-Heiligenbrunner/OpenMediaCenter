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
