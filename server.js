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

app.post('/upload',function (req, res, next) {
    var fstream;
    req.pipe(req.busboy);
    var files = [];
    var fileCounter = 0;
    var finished = false;
    req.busboy.on('file', function (fieldname, file, filename) {
        if (!fs.existsSync(uploadedDir)){
		    fs.mkdirSync(uploadedDir);
		}
		var fileName = (new Date()).getTime() +"-"+ filename;
        fstream = fs.createWriteStream(uploadedDir + fileName);
	    file.pipe(fstream);
	    fileCounter++;
	    fstream.on('close', function () {  
	    	console.log("uploaded file to : "+ path.join(__dirname ,fileName)); 
	    	files.push(fileName); 
	    	if(--fileCounter == 0 && finished){
	    		finished = false;
	    		res.send({
		    		"successful":true,
			        "files": files
		    	});
	    	}	    	
	    	            
	    });    
    });
    req.busboy.on('finish', function() {
    	console.log("Server received all files.")
    	finished = true;
    });
});

var server = http.createServer(app).listen(3000, function () {
	console.log('server is listenning on localhost:3000');
});


