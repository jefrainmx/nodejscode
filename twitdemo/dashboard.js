#!/usr/bin/env node

sys     = require('util');
express = require('express');
http = require('http');
twitter = require('ntwitter');

app = express();
//app.configure(function(){
  app.use(express.static(__dirname + '/public'));
//});

app.get('/', function(req, res, next){
  res.render('/public/index.html');
});
server = http.createServer(app)
server.listen(8081);
console.log('Server running at http://localhost:8081/');

var io  = require('socket.io').listen(server);
io.set('log level', 0);

myList = ["@deptolucafc", "@Chiapas_FC", "@CF_America", "@TigresOficial", "@Club_Queretaro", "@Tuzos", "@PueblaFC", "@FuerzaMonarca", "@Rayados", "@clubleonfc", "@PumasMX", "@XolosOficial", "@Cruz_Azul_FC", "@ClubSantos", "@tiburonesrojos", "@atlasfc", "@Chivas", "@LeonesNegrosCF", "@LIGABancomerMX "];
Array.prototype.del = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}

CreateTwitter();
io.sockets.on('connection', function(socket) {
    socket.on('data', function(action,data) {

	if(action==='+') {
            console.log(myList);
        	myList.push(data);
            console.log(myList);
	}
	if(action==='-') {
        console.log(data);
		myList.del(data);
	}
	if(action==='*') {
            twit.updateStatus(data,
                function (err, data) {
                  console.log(data);
                });
	}
    });
    socket.on('getfilter', function() {
        console.log(myList);
        socket.emit('pushfilter', myList);
    });
    if(myList.length!=0) {
        twit.stream('user',{track:myList}, function(stream) {
            stream.on('data', function (tweet) {
  	    	    socket.emit('message', JSON.stringify(tweet));
            });
            stream.on('error', function(error, code) {
                console.log("My error: " + error + ": " + code);
            });              
        });
    }   
});

function CreateTwitter() {
twit = new twitter({
    consumer_key:         'WRgVUPTe2fbVscjP3G7qVpiVC',
    consumer_secret:      'dd6UE7vZOqmu921iMpAopmftaHRjFOe2EyvqtBgJrTjmlvnAZi',
    access_token_key:     '47490206-JnzCvNRlu2mMLwj12xOBHCtHiFMSM8aY9f3uqWs8W',
    access_token_secret:  'lzCfjx5mZ1nepPdmLNtWbjKUzaMrOxs5OWomvtzAGKodj'
});
}
