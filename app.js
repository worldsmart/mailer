const express = require('express');
const app = express();

const port = 8080;

app.get('/',(req, res)=>{
    res.send('Hello heroku!');
});

app.listen(process.env.PORT || port, ()=>{
    console.log("server runing on port: " + port);
});