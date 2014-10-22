#!/usr/bin/env node

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var twitter = require('ntwitter');

// set up handlebars view engine
var handlebars = require('express3-handlebars').create({ defaultLayout:'main' });
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

server.listen(80);
console.log('Server running at http://localhost:80/');

io.set('log level', 0);

var fortunes = [
"Conquer your fears or they will conquer you.",
"Rivers need springs.",
"Do not fear what you don't know.",
"You will have a pleasant surprise.",
"Whenever possible, keep it simple.",
];	

app.get('/', function(req, res) {
	res.render('home');
});
app.get('/about', function(req, res) {
	var randomFortune =
	fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about', { fortune: randomFortune });
});
app.get('/contact', function(req, res) {
    res.render('contact');
});
// 404 catch-all handler (middleware)
app.use(function(req, res, next){
	res.status(404);
	res.render('404');
});
// 500 error handler (middleware)
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

//var myList = ["@deptolucafc", "@Chiapas_FC", "@CF_America", "@TigresOficial", "@Club_Queretaro", "@Tuzos", "@PueblaFC", "@FuerzaMonarca", "@Rayados", "@clubleonfc", "@PumasMX", "@XolosOficial", "@Cruz_Azul_FC", "@ClubSantos", "@tiburonesrojos", "@atlasfc", "@Chivas", "@LeonesNegrosCF", "@LIGABancomerMX"];
var myList = ["@TigresOficial", "@Rayados", "@LIGABancomerMX"];
Array.prototype.del = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

var twit = new twitter({
    consumer_key:         'WRgVUPTe2fbVscjP3G7qVpiVC',
    consumer_secret:      'dd6UE7vZOqmu921iMpAopmftaHRjFOe2EyvqtBgJrTjmlvnAZi',
    access_token_key:     '47490206-JnzCvNRlu2mMLwj12xOBHCtHiFMSM8aY9f3uqWs8W',
    access_token_secret:  'lzCfjx5mZ1nepPdmLNtWbjKUzaMrOxs5OWomvtzAGKodj'
});

io.on('connection', function(socket) {
    console.log("OnConnection");
    socket.on('data', function(action,data) {
        console.log("OnData");
        if(action==='+') {
            console.log("add:" + data);
            myList.push(data);
            console.log("new list:" + myList);
            //socket.emit('changefilter', myList);
        }
        if(action==='-') {
            console.log("del:" + data);
            myList.del(data);
            console.log("new list:" + myList);
            //socket.emit('changefilter', myList);
        }
    });    
    socket.on('getfilter', function() {
        console.log("onFilter");
        socket.emit('pushfilter', myList);
    });
    twit.stream('user',{track:myList}, function(stream) {
        console.log("onStreamTwitter");
        stream.on('data', function (tweet) {
	    	    socket.emit('message', JSON.stringify(tweet));
        });
        stream.on('error', function(error, code) {
            console.log("My error: " + error + ": " + code);
        });              
    });
});
