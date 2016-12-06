var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session')
var fs = require('fs');
var busboy = require('connect-busboy'); 
var http = require('http');
var parseurl = require('parseurl')
const path = require('path');
var uploadedDir = __dirname + path.sep + 'uploaded'+ path.sep;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { 
  	secure: false,
  	maxAge:1000*60*60*24 
  }
}))

app.post('/login',function(req, res, next){

	if(req.body.username == 'admin' && req.body.password=='123'){
		req.session.views = 10;
		req.session.user = req.body.username;
		res.redirect("/public/index.html");
	}else{
		fs.readFile(path.join(__dirname, 'login.html'), (err, data) => {
		  if (err) throw err;
		  res.setHeader('content-type', 'text/html');
		  res.send(data);
		});
	}
});

app.use(function (req, res, next) {
  var views = req.session.views;
  var user = req.session.user;
  if (!user) {
    //views = req.session.views = {};
    //res.sendFile();
    fs.readFile(path.join(__dirname, 'login.html'), (err, data) => {
	  if (err) throw err;
	  res.setHeader('content-type', 'text/html');
	  res.send(data);
	});
  }else{
  	next();
  }
})

app.use("/public",express.static(__dirname + '/public'));
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


