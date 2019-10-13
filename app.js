const dns = require('dns');
const net = require('net');
let nextCommand = require('./commands.js');

let data = {
    from:'trolerman2892038@gmail.com',
    to:'mail1@onyame.ml',
    massageText:'text text text\u000D\u000Atext2 text2 \u000D\u000A',
    subject:'subject',
    id:'fdgfdg124234zd',
    attachments:[
        {
            contentType: 'image/png',
            body: 'fVkVvYassFAAAABQAAAAIAAAAbWltZXR5cG==',
            filename:'mypicture.png'
        },
        {
            contentType: 'image/png',
            body: 'fVkVvYassFAAAABQAAAAIAAAAbWltZXR5cG==',
            filename:'mypicture1.png'
        }
    ]
};

dns.resolve('shikimori.org', 'MX', (err,records)=>{
    if(!err){
        records = sort(records);
        let socket = new net.Socket();
        socket.setEncoding('utf8');
        socket.setTimeout(15000);
        socket.on('data', (str)=>{
            console.log(str);
            let tmp = str.substring(0, str.indexOf(' '));
            tmp = parseFloat(tmp);
            if(!tmp) {
                socket.end('501 Bad err code');
            }
            else if(tmp / 100 >= 5){
                socket.end('501 Close due error');
            }else {
                if (nextCommand) {
                    nextCommand = nextCommand(socket, data);
                    if(nextCommand && nextCommand['err']){
                        socket.end('Server error');
                        console.log(nextCommand['err']);
                    }
                }
                else {
                    socket.end('Close');
                }
            }
        });
        /*records[0].exchange*/
        socket.connect(25, 'localhost', ()=>{
            console.log("Client: Connected to server");
        });
    }
});

function sort(enter, out = []) {
    let len = enter.length;
    for (let i = 0; i < len; i++) {
        let largest = {priority:0};
        for (let y = 0;y < enter.length;y++){
            if(enter[y].priority > largest.priority) largest = enter[y];
        }
        enter = enter.filter(r=>{
            return r == largest ? false : true;
        });
        out.push(largest);
    }
    return out;
}