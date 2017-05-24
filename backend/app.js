var express=require('express');
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var api=require('./routes/api');
var auth = require('./routes/auth');
var songs = require('./routes/songs');
var users = require('./routes/users');
var playlist = require('./routes/playlist');

app.use(bodyParser.json({type: function() {return true;}}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  //intercepts OPTIONS method
  if ('OPTIONS' === req.method) {
    //respond with 200
    res.status(200).send('');
  }
  else {
  //move on
    next();
  }
});

app.use('/api', api);
app.use('/api/auth',auth);
app.use('/api/songs', songs);
app.use('/api/users', users);
app.use('/api/playlist',playlist);

//Habilito la conexion
io.sockets.on('connection', function(socket) {
	socket.on('tokenGroup', function(token) {
		socket.join(token);//Agrupo a los clietes conectado por token
	});
});
app.locals.socket=io;

server.listen(4000,function(){
    console.log('App is listening on port 4000');
});