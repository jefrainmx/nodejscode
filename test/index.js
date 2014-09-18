var express = require('express');

var app = express();

app.get('/', function(req, res){
    res.send('Hello from inside a container path.dirname(path);!');
});

app.listen(8080);