var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// User the EJS view engine
app.set('view engine', 'ejs');

// Static file serving
app.use(express.static(__dirname + '/public'));

// App routing
app.get('/markdown', function(req, res) {
  res.render('pages/markdown-join.ejs');
});
app.get('/markdown/(:room)', function(req, res) {
  res.render('pages/markdown.ejs');
});
app.get('/chat', function(req, res) {
  res.render('pages/chat.ejs');
});

// Markdown editor networking code
var markdownEditor = io.of('/markdown');
markdownEditor.on('connection', function (socket) {
  console.log('A new user connected');

  socket.on('pad change', function (data) {
    console.log(data);
    socket.to(data.room).broadcast.emit('fresh pad', data.pad);
  });

  socket.on('mdroom', function (room) {
    console.log('joining room ' + room);
    socket.join(room);
  });

  socket.on('refresh', function (room) {
    var list = markdownEditor.adapter.rooms[room];
    console.log(list);
    socket.emit('userlist', {users: list, you: socket.id});
  });

  socket.on('disconnect', function () {
    console.log('user disconnected: ' + socket.id);
  });

});


// Chatroom networking code
var chatRoom = io.of('/chat');
chatRoom.on('connection', function(connection) {
  connection.on('connection', function(socket) {
    console.log('A new user connected to the chat');

    socket.on('disconnect', function (socket) {
      console.log('A user disconnected');
    });

  });
});

app.use(function(req, res) {
  // TODO: Make a 404 page
  res.status(404).end('error');
});

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
http.listen(port, function () {
  console.log("Listening on *:8000");
});
