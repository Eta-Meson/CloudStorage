var express = require('express');
var jquery = require('./js/jquery.min.js')
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var url = 'mongodb://localhost:27017/lab-proj';
var db = require('mongodb').MongoClient
var format = require('util').format;
var ejs = require('ejs');
var uname = 'krish';
var dir_path = '/home/icebyte/Desktop/uploads/'+uname+'/';
var helpers = require('express-helpers');
var binaryserver = require('binaryjs').BinaryServer;

helpers(app);
console.log(dir_path);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(express.static('public/'));
app.use(express.static('js'));
app.use(express.static('/home/icebyte/Desktop/uploads/'));
db.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
		signin = db.collection('signin');
  }
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
//sign in get
app.get('/signin',function(req,res){
  res.sendFile(path.join(__dirname+'/signin.html'));
});
//sign in post
app.post('/signin', function(req, res) {
	console.log(req.body);
	userexists(req.body.Name, req.body.Password, res);
});
//sign up get

app.get('/signup',function(req,res) {
  res.sendFile(path.join(__dirname+'/signup.html'));
});
//sign up post
app.post('/signup',function(req,res) {
	console.log(req.body);
  reguser(req.body.Name, req.body.Password, res);
});

// redirect users

app.get('/users/:id',function(req,res){
  
});

app.get('/test',function(req, res) {
	fs.readdir(dir_path, function(err, items) {
    console.log("it woks!!");
    	var data = {	title:	'Cleaning Supplies',supplies:	['mop', 'broom', 'duster'], list:items};
			res.render('index',data);
	});
})
app.delete('/', function(req, res) {

});

app.listen(4444,'127.0.0.1');


// It verifies username and password and sends response to res stream
function userexists(username, password, res) {
	db.connect(url, function(err, db) {
    if(err) throw err;
    var signin = db.collection('signin');
      // Locate all the entries using find
      signin.find({'Name': username}).toArray(function(err, results) {
        console.dir(results);
        if(!results.length) {
        	res.sendFile(path.join(__dirname+'/signin.html'));
        	console.log('Invalid Username');
        }
        else {
			      var result = results[0];
			      // Check username and password
			      if(result.Password === password) {
			      	// Auth successful
			      	res.sendFile(path.join(__dirname+'/index.html'));
			      }
			      else {
			      	res.sendFile(path.join(__dirname+'/signin.html'));
			      }    
      	}
			      db.close();
      });
  });
}

function reguser(username, password, res) {
	console.log('reguser reached');
	db.connect(url, function(err, db) {
    if(err) throw err;
    var signin = db.collection('signin');
      // insert entries
     signin.insert({'Name': username, 'Password': password}); 
      	console.log("insert succesful");
    		res.sendFile(path.join(__dirname+'/index.html'));
			db.close();
  });
}
