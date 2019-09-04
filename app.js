const express = require('express');
const app = express();

const port = 8080;

app.get('/',(req, res)=>{
    res.send('Hello heroku!');
});

app.listen(process.env.PORT || port, ()=>{
    console.log("server runing on port: " + port);
});

const net = require('net');
const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('STATUS: 230 | onyame.ml | ESMTP\u000D\u000A');
}).on('error', (err) => {
    throw err;
});

server.listen( 25 ,() => {
    console.log('opened server on', server.address());
});