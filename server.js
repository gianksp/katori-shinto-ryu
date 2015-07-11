var http = require('http');
var express = require('express');
var path = require('path');
var app = express();

var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;


var bodyParser = require('body-parser');
// default to a 'localhost' configuration:
var connection_string = '127.0.0.1:27017/katori';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}


var db = mongojs(connection_string, ['katori']);
var announcements = db.collection('announcements');



app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1');

http.createServer(app).listen(app.get('port'), app.get('ip'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.use(express.static('client'));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});
app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
// app.use(express.json());       // to support JSON-encoded bodies
// app.use(express.urlencoded());

app.get('/announcements', function (req, res) {
  	// similar syntax as the Mongo command-line interface
	// log each of the first ten docs in the collection
	announcements.find(function (err, docs) {
    // docs is an array of all the documents in mycollection
    	res.json(docs);
	});
});

app.get('/remove', function (req, res) {
  
  var id = req.param('id');
  announcements.remove({'_id':ObjectId(id)},function() { res.json({success:true});  });
});

app.post('/add', function(req, res) {
    var id = req.param('id');
    var jsonString='';
  	req.on('data', function (data) { jsonString += data; });
  	req.on('end', function () {
      	var obj = JSON.parse(jsonString);
        // console.log(obj);
        if (obj['_id']) {
            var id = ObjectId(obj['_id']);
            delete obj['_id'];
            console.log(obj);
            announcements.update({'_id':id},obj,function (err, doc) {
              console.log(err);
              console.log(doc);
              // docs is an array of all the documents in mycollection
                res.json(doc);
            });
        } else {
            announcements.save(obj,function (err, doc) {
              // docs is an array of all the documents in mycollection
                res.json(doc);
            });
        }

  	});
});

// app.use(function(req, res, next) {
//   var contentType = req.headers['content-type'] || ''
//     , mime = contentType.split(';')[0];

//   if (mime != 'text/plain') {
//     return next();
//   }

//   var data = '';
//   req.setEncoding('utf8');
//   req.on('data', function(chunk) {
//     data += chunk;
//   });
//   req.on('end', function() {
//     req.rawBody = data;
//     next();
//   });
// });