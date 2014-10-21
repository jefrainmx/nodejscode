var socket = io.connect('http://localhost:80');
socket.on("connect", function() {
	socket.emit('getfilter', function() {
});
	console.log("connected");
});

socket.on("pushfilter", function(f) {
    filters=f;
    filters.forEach(function(str) {
    	$("<span class='label label-info'></span>").html("<i class='icon-remove-circle'></i> " + str).prependTo("#lista");
    });
});

  socket.on('message', function (data) {
  	if (data != null && data != NaN && data != ''){
	  	tweet = JSON.parse(data);
	    console.log(tweet);
	    if (typeof(tweet.user) !== 'undefined' && typeof(tweet.user.screen_name) !== 'undefined')
	    	$("<div class='alert alert-info' role='alert'></div>").html("[" + tweet.user.screen_name + "] " + tweet.text + "<a href=https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str + " target='_blank'>...</a>").prependTo("#tweets")
	    		.css("margin-bottom", "5px")
	    		.css({opacity:0}).slideDown("slow").animate({opacity:1},"slow");
	} else {
	    console.log("Invalid Object");
	};	
});
socket.on("disconnect", function() {
    console.log("disconnected");
});