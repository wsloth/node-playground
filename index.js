var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// set the view engine to ejs
app.set('view engine', 'ejs');

// public folder to store assets
app.use(express.static(__dirname + '/public'));

// routes for app
app.get('/', function(req, res) {
  res.render('pages/index.ejs');
});

// Socket code
io.on('connection', function(socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

  socket.on('pad change', function (value) {
    console.log(value);
    io.emit('fresh pad', value);
  });
});

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
http.listen(port, function () {
  console.log("Listening on *:8000");
});
