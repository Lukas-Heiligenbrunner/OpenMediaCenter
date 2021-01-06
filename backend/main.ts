import express from 'express';
import {TestNode} from './TestNode';

const app = express();
const port = 3000;

app.use(function(req, res, next) {
    const contentType = req.headers['content-type'] || '', mime = contentType.split(';')[0];

    let data = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        data += chunk;
    });
    req.on('end', function() {
        req.body = JSON.parse(data);
        next();
    });
});

// add api nodes
addNodes();

app.listen(port, () => {
    return console.log(`server is listening on ${port}`);
});

function addNodes(){
    app.post('/api', new TestNode().handler);
}
