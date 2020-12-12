function getAPIDomain(): string {
    const hostname = window.location.hostname;
    if (hostname !== '') {
        return (`http://${hostname}/api/`);
    } else {
        // todo we should place an popup here and ask
        // we are in an electron window here...
        return 'http://192.168.0.209/api/';
    }
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

export function callAPI(apinode: string, fd: ApiBaseRequest, callback: (_: object) => void): void {
    fetch(getAPIDomain() + apinode, {method: 'POST', body: buildFormData(fd)})
        .then((response) => response.json()
            .then((result) => {
                callback(result);
            }));

}

export function callAPIPlain(apinode: string, fd: ApiBaseRequest, callback: (_: any) => void): void {
    fetch(getAPIDomain() + apinode, {method: 'POST', body: buildFormData(fd)})
        .then((response) => response.text()
            .then((result) => {
                callback(result);
            }));

}
