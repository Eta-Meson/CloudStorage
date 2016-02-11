var express = require('express'),
    fs = require('fs')
    url = require('url');
var app = express();


app.use('/public', express.static(__dirname + '/public'));  
app.use(express.static(__dirname + '/public')); 

app.get('/',function(req, res) {
    res.send('Hello World');
    res.end;
})

app.post('/receive', function(request, respond) {
    var body = '';
    filePath = __dirname + '/public/data.txt';
    request.on('data', function(data) {
        body += data;
    });

    request.on('end', function (){
        fs.appendFile(filePath, body, function() {
            respond.end();
        });
    });
});

app.listen(8005);