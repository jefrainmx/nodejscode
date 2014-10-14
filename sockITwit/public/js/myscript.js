var socket = io.connect();
socket.on('message', function(json) {
    data = JSON.parse(json);
    var replacePattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var replacedText = (data.text).replace(replacePattern, '<a href="$1" target="_blank">$1</a>');
	$("<li></li>").html("[" + data.user.screen_name + "] " + replacedText);
});
socket.on("disconnect", function() {
    console.log("disconnected");
});
socket.on('error', function(error, code) {
    console.log("My error: " + error + ": " + code);
}); 
