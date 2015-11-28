var express     =   require('express');
var jquery      =   require('./public/js/jquery.min.js');
var fs          =   require('fs');
var path        =   require('path');
var bodyParser  =   require('body-parser');
var app         =   express();
var url         =   'mongodb://localhost:27017/lab-proj';
var db          =   require('mongodb').MongoClient;
var format      =   require('util').format;
var ejs         =   require('ejs');
var uname       =   'test';
var dir_path    =   '/home/icebyte/Desktop/uploads/';
var helpers     =   require('express-helpers');
var multer      =   require('multer');
var session     =   require('express-session');
var methodOverride = require('method-override');
var cookie      = require('cookie-parser');
var md5File     = require('md5-file')
var sess;

helpers(app);
console.log(dir_path);

app.use(cookie());
app.use(session({secret: 'secret',
                saveUninitialized: true,
                resave : true}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json());
app.use(express.static('public/'));
app.use(express.static('/home/icebyte/Desktop/lab-proj/public/'));
app.use('/users',express.static('/home/icebyte/Desktop/uploads/'));

//app.use('/users',express.static('/home/icebyte/Desktop/uploads/'));

db.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
		signin = db.collection('signin');
  }
});

app.get('/',function(req,res){
  sess = req.session;
  console.log("session user is "+sess.user);
  if(!sess.user) {
    res.sendFile(path.join(__dirname+'/views/index.html'));
    res.end;
  }
  else {
    console.log("else case");
    var redirect_url = '/users/'+sess.user;
    res.redirect(302, redirect_url);
    res.end
  }
});

//sign in get --Done
app.get('/signin',function(req,res){
  sess = req.session;
  if(!sess.user) {
    res.sendFile(path.join(__dirname+'/views/signin.html'));    
    res.end;
  }
  else {
    var redirect_url = '/users/'+sess.user;
    res.redirect(302, redirect_url);
    res.end
  }
});

//sign in post --Done
app.post('/signin', function(req, res) {
	// console.log(req.body);

	userexists(req.body.name, req.body.password, req, res);
});

//sign up get --Done
app.get('/signup',function(req,res) {
  res.sendFile(path.join(__dirname+'/views/signup.html'));
  res.end;
});

//sign up post --Done
app.post('/signup',function(req,res) {
	//console.log(req.body);
  reguser(req.body.name, req.body.password, req.body.email, res);
});

// redirect users -- Done
app.get('/users/:id',function(req,res) {
   console.log(req.params.id);
  sess = req.session;
  console.log("sess users is "+sess.user);
  if(sess.user) {
    if(sess.user === req.params.id) {
    fs.readdir(dir_path +'/'+ req.params.id, function(err, items) {
      console.log("it woks!!");
      fs.stat(dir_path +'/'+ req.params.id, function(err, stats) {
          //console.log(stats);
        var data = {list:items, lists:stats};
        res.render('index', data);
        res.end;
        console.log('rendering done'); 
        });
      })
    }
    else {
    res.send('<h1><b>NOT AUTHORIZED</b></h1>');
    res.end;
     
    }
  }
  else {
    res.sendFile(path.join(__dirname+'/views/signin.html'));    
    res.end;
  }
});

//Download link for files
app.get('/users/:id/:filename/download',function(req,res) {
  sess = req.session;
  if(sess.user) {
    res.download(dir_path+'/'+req.params.id+'/'+req.params.filename);
  }
  else {
    res.sendFile(path.join(__dirname+'/views/signin.html'));    
    res.end;
  }
})

//Upload file to server
app.post('/fileUpload',function(req, res) {
  
});
// logout
app.get('/logout', function(req, res) {
  req.session.destroy(function(err){
    if(err) {
      console.log(err);
    }
    else {
      var redirect_url = '/';
      res.redirect(302, redirect_url);
    }
  });
});

// test url
app.get('/test',function(req, res) {
	fs.readdir(dir_path+'/krish', function(err, items) {
    console.log("it woks!!");
    var data = {list:items};
		res.render('index',data);
	});
})
app.delete('/', function(req, res) {

});

app.listen(4444,'127.0.0.1');
// END OF APP

// It verifies username and password and sends response to res stream
// Function for signing in -- Done
function userexists(username, password,req, res) {
	db.connect(url, function(err, db) {
    if(err) throw err;
    var signin = db.collection('signin');
      // Locate all the entries using find
      signin.find({'name': username}).toArray(function(err, results) {
        console.dir(results);
        if(!results.length) {
        	res.sendFile(path.join(__dirname+'/views/signin.html'));
        	console.log('Invalid Username');
        }
        else {
		      var result = results[0];
		      // Check username and password
		      if(result.password === password) {
            req.session.user = username;
            console.log("auth successful");
		      	// Auth successful
            var redirect_url = '/users/'+username;
            res.redirect(302, redirect_url);
            res.end
		      }
		      else {
		      	res.sendFile(path.join(__dirname+'/views/signin.html'));
		      }    
      	}
        db.close();
      });
  });
}

// Function for students registering --Done (check if user already exists)
function reguser(username, password, email, res) {
	db.connect(url, function(err, db) {
    if(err) throw err;
    var signin = db.collection('signin');
      // insert entries
      signin.insert({'name': username, 'password': password, 'email': email}); 
      console.log("insert succesful");
      create_folder(username);
    	res.sendFile(path.join(__dirname+'/views/signin.html'));
			db.close();
  });
}

// creates a folder for the user
function create_folder(username) {
  if (!fs.existsSync(dir_path+username)){
    fs.mkdirSync(dir_path+username);
  }
}


//Upload file to server
function upload_file(){

}