import express from 'express';
import { TestNode } from './TestNode';
import { connect } from './Database';

const app = express();
const port = 3000;

app.use(function (req, res, next) {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        req.body = JSON.parse(data);
        next();
    });
});

// add api nodes
addNodes();

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});

function addNodes(): void {
    app.post('/api', new TestNode().handler);
}

connect();
