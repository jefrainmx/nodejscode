  var socket = io.connect('http://localhost:80');
  socket.on('message', function (data) {
  	if (data != null && data != NaN && data != ''){
	  	tweet = JSON.parse(data);
	    console.log(tweet);
	    if (typeof(tweet.user) !== 'undefined' && typeof(tweet.user.screen_name) !== 'undefined')
	    	$("<li></li>").html("[" + tweet.user.screen_name + "] " + tweet.text + "<a href=https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str + " target='_blank'>...</a>").prependTo("ul.unstyled");
	} else {
	    console.log("Invalid Object");
	};
});