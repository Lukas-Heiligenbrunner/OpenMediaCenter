import express from 'express';

export interface RequestData {
    action: string;
}

interface handlerarray {
    [index: string]: (data: any) => any;
}

export abstract class APIBase {
    constructor() {
        this.addHandlers();
        console.log(this.handlers);

        this.handler = this.handler.bind(this);
    }

    handlers: handlerarray = {};

    handler(req: express.Request, res: express.Response): void {
        const actionstring: string = req.body.action;

        if (!actionstring) {
            res.status(400).send('no action key provided');
        } else {
            if (this.handlers[actionstring]) {
                res.send(this.handlers[actionstring](req.body));
            } else {
                res.status(400).send('invalid action key');
            }
        }
    };

    addHandler<Request extends RequestData, Response>(action: string, handler: (data: Request) => Response): void {
        console.log('addhandler called');
        this.handlers[action] = handler;
    }

    abstract addHandlers(): void;
}
