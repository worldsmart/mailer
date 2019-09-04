const net = require('net');
const server = net.createServer((socket) => {
    socket.setEncoding('utf8');
    socket.write('STATUS: 230 | onyame.ml | ESMTP\u000D\u000A');
}).on('error', (err) => {
    throw err;
});

server.listen(process.env.PORT ||  25 ,() => {
    console.log('opened server on', server.address());
});