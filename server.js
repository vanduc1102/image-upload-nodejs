var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var busboy = require('connect-busboy'); 
var http = require('http');
const path = require('path');
var uploadedDir = __dirname + path.sep + 'uploaded'+ path.sep;

app.use(express.static(__dirname + '/public'));
app.use(busboy());

app.route('/upload')
.post(function (req, res, next) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        if (!fs.existsSync(uploadedDir)){
		    fs.mkdirSync(uploadedDir);
		}
		var fileName = (new Date()).getTime() +"-"+ filename;
        fstream = fs.createWriteStream(uploadedDir + fileName);
	    file.pipe(fstream);
	    fstream.on('close', function () {                
	        res.send({"successful":true});
	    });    
    });
});

var server = http.createServer(app).listen(3000, function () {
	console.log('server is listenning on localhost:3000');
});


