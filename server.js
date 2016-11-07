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
        console.log("Uploading: " + filename);
        if (!fs.existsSync(uploadedDir)){
		    fs.mkdirSync(uploadedDir);
		}
        //Path where image will be uploaded
        fstream = fs.createWriteStream(uploadedDir + (new Date()).getTime() +"-"+ filename);
    	fstream.on('open',function(fd){
	    	file.pipe(fstream);
	        fstream.on('close', function () {    
	            console.log("Upload Finished of " + filename);              
	            res.send({"successful":true});           //where to go next
	        });   
        });     
    });
});

var server = http.createServer(app).listen(3000, function () {
	console.log('server is listenning on localhost:3000');
});


