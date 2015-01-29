var express = require('express');
var app = express();
var http = require('http');
app.use(express.static(__dirname + '/public'));
var server = http.createServer(app).listen(3000, function () {
	console.log('server is listenning on localhost:3000');
});
