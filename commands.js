const mimemessage = require('mimemessage');

let msg = null;

module.exports = (socket, data)=>{
    if(!data) return {err:'No data'};
    msg = data;
    if(!msg.subject) msg.subject = 'No subject';

    msg.mime = 'From: <'+msg.from+'>\u000D\u000ATo: <'+msg.to+'>\u000D\u000ADate:'+ new Date()+'\u000D\u000ASubject: '+ msg.subject +'\u000D\u000AMIME-Version: 1.0\u000D\u000A';
    let multipart = mimemessage.factory({
        contentType: 'multipart/mixed',
        body: [
            mimemessage.factory({
                contentType: 'multipart/alternate',
                body: []
            }),
            mimemessage.factory({
                body: msg.massageText
            })
        ]
    });
    multipart.header('Message-ID', '<'+msg.id+'>');
    if(msg.attachments){
        msg.attachments.forEach(at=>{
            let tmp = mimemessage.factory({
                contentType: at.contentType,
                contentTransferEncoding: 'base64',
                body: at.body
            });
            tmp.header('Content-Disposition', 'attachment ;filename="'+at.filename+'"');
            multipart.body.push(tmp);
        });
    }
    msg.mime += multipart.toString();

    socket.write('EHLO onyame.ml\u000D\u000A');
    return from;
};

function from(socket) {
    if(!msg.from) return {err:'No sender'};
    socket.write('MAIL FROM: <'+msg.from+'>\u000D\u000A');
    return to;
}

function to(socket) {
    if(!msg.to) return {err:'No receiver'};
    socket.write('RCPT TO: <'+msg.to+'>\u000D\u000A');
    return data;
}

function data(socket) {
    socket.write('DATA\u000D\u000A');
    return body;
}

function body(socket) {
    socket.write(msg.mime);
    socket.write('\u000D\u000A.\u000D\u000A');
    return null;
}