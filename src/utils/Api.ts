let customBackendURL: string;

function getAPIDomain(): string {
    return getBackendDomain() + '/api/';
}

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

export function setCustomBackendDomain(domain: string) {
    customBackendURL = domain;
}

interface ApiBaseRequest {
    action: string,

    [_: string]: string
}

function buildFormData(args: ApiBaseRequest): FormData {
    const req = new FormData();

    for (const i in args) {
        req.append(i, args[i]);
    }
    return req;
}

export function callAPI(apinode: string, fd: ApiBaseRequest, callback: (_: object) => void, errorcallback: (_: object) => void = (_: object) => {
}): void {
    fetch(getAPIDomain() + apinode, {method: 'POST', body: buildFormData(fd)})
        .then((response) => response.json()
            .then((result) => {
                callback(result);
            })).catch(reason => errorcallback(reason));
}

export function callAPIPlain(apinode: string, fd: ApiBaseRequest, callback: (_: any) => void): void {
    fetch(getAPIDomain() + apinode, {method: 'POST', body: buildFormData(fd)})
        .then((response) => response.text()
            .then((result) => {
                callback(result);
            }));

}
