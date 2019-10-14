const nodemailer = require('nodemailer');
const dns = require('dns');

dns.resolve('gmail.com', 'MX', (err,records)=>{
    let transporter = nodemailer.createTransport({
        host: records[0].exchange,
        port: 25,
        secure: false
    });

    transporter.sendMail({
        from: 'tester@onyame.ml',
        to: 'tester@onyame.ml',
        subject: 'Hello ✔',
        text: 'Hello world?',
        html: '<b>Hello world?</b>'
    }, (err)=>{
        console.log('ffff', err)
    });
});