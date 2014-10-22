var socket = io.connect('http://localhost:80',
 		{'reconnectionDelay': 500,
       		'reconnectionAttempts': 5}
	);

socket.on('message', function (data) {
	if (data != null && data != NaN && data != ''){
	  	tweet = JSON.parse(data);
    	//console.log(tweet);
    if (typeof(tweet.user) !== 'undefined' && typeof(tweet.user.screen_name) !== 'undefined')
    	$("<div class='alert alert-info' role='alert'></div>").html("[" + tweet.user.screen_name + "] " + tweet.text + "<a href=https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str + " target='_blank'>...</a>").prependTo("#tweets")
    		.css("margin-bottom", "5px")
    		.css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
	} else {
    	console.log("Invalid Object");
	};	
});

socket.on("connect", function() {
	socket.emit('getfilter', function() {
	});
	console.log("connected");
});

socket.on("disconnect", function() {
    console.log("disconnected");
});

socket.on("reconnect", function() {
    console.log("reconnect");
});
socket.on("pushfilter", function(f) {
    filters=f;
    $('#lista').empty();
    filters.forEach(function(str) {
    	$("<span class='label label-info'></span>").html("<a class='icon-remove-circle' onclick='delFilter(\"" + str + "\"); return false;'></a> " + str).prependTo("#lista");
    });
});

socket.on("error", function(error, code) {
    console.log("My error: " + error + ": " + code);
}); 

function delFilter(val) {
    socket.emit( 'data', '-', val);
    socket.io.disconnect();
   	socket.io.reconnect();        
};
