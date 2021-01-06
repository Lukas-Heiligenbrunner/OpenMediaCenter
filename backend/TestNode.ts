import {APIBase, RequestData} from './APIBase';

interface requesti extends RequestData{
    test: number;
}

interface responsi{
    myreturnnumber: number;
}

export class TestNode extends APIBase {
    addHandlers(): void {
        console.log("addhandlers called");
        this.addHandler<requesti, responsi>('testaction', (request) => {
            console.log(request);
            return {myreturnnumber: 5};
        });
    }
}
