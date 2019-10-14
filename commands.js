const mimemessage = require('mimemessage');
const crypto = require('crypto');
const fs = require('fs');

let msg = null;

module.exports = (socket, data)=>{
    if(!data) return {err:'No data'};
    msg = data;
    if(!msg.subject) msg.subject = 'No subject';

    msg.mime = 'From: <'+msg.from+'>\u000D\u000ATo: <'+msg.to+'>\u000D\u000ADate: '+ new Date().toUTCString()+'\u000D\u000ASubject: '+ msg.subject +'\u000D\u000AMIME-Version: 1.0\u000D\u000AMessage-ID: <'+msg.id+'>\u000D\u000A';

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
    if(msg.attachments && msg.attachments[0]){
        msg.attachments.forEach(at=>{
            let tmp = mimemessage.factory({
                contentType: at.contentType,
                contentTransferEncoding: 'base64',
                body: at.body
            });
            tmp.header('Content-Disposition', 'attachment ;filename="'+at.filename+'"');
            multipart.body.push(tmp);
        });
    };
    msg.mime += multipart.toString();

    /*let header = msg.mime.substring(0, msg.mime.match(/\u000D\u000A\u000D\u000A/).index).replace(/^(.*:)/gm, (v)=>{ return v.toLowerCase(); }).replace(/^(.*:)[\r\n\t\f\v ]/gm, '$1');
    let body = msg.mime.substring(msg.mime.match(/\u000D\u000A\u000D\u000A/).index + 4).replace(/[ \t]+\r\n/g, '\r\n').replace(/[ \t]+/g, ' ').replace(/\r\n{2,}$/g, '\u000D\u000A');
    let hb = crypto.createHash('sha256').update(body).digest('base64');
    let signature = 'DKIM-Signature: v=1; a=rsa-sha256; q=dns/txt; c=relaxed/relaxed; d=onyame.ml; s=def;\u000D\u000A' +
        'h=From:To:Date:Subject:MIME-Version:Message-ID:Content-Type; bh='+hb+';\u000D\u000A' +
        'b=;';
    signature = signature.replace(/b=;$/, 'b=' + crypto.createSign('sha256').update(header + signature.replace(/\u000D\u000A/g, ' ')).sign(fs.readFileSync('./private.pem', 'utf8'), 'base64') + ';\u000D\u000A');
    msg.mime = signature + msg.mime;
    console.log(msg.mime);*/

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