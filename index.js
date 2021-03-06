var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore')._;

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
markdownEditor.on('connection', function(socket) {
	console.log('A new user connected');

	socket.on('pad change', function(data) {
		console.log(data);
		socket.to(data.room).broadcast.emit('fresh pad', data.pad);
	});

	socket.on('mdroom', function(room) {
		console.log('joining room ' + room);
		socket.join(room);
	});

	socket.on('refresh', function(room) {
		var list = markdownEditor.adapter.rooms[room];
		console.log(list);
		socket.emit('userlist', {
			users: list,
			you: socket.id
		});
	});

	socket.on('disconnect', function() {
		console.log('user disconnected: ' + socket.id);
	});

});

var handlerObject = require('./chat.js');
var handler;
var chatRoom = io.of('/chat');
chatRoom.on('connection', function (socket) { handler = new handlerObject(socket); });

/* Chatroom code /////////////////////////////////////////////////////////////////////////
var people = {};
var rooms = {};
var sockets = [];
var chatHistory = {
	'general': {}
};

// Chatroom networking code
var chatRoom = io.of('/chat');
chatRoom.on('connection', function(socket) {

	var username = '_nousr';

	console.log('New user ' + socket.id + ' connected');

	socket.on('joinServer', function(nickname) {
		var exists = false;

		_.find(people, function(key, val) {
			if (key.name.toLowerCase() === nickname.toLowerCase()) {
				return exists = true;
			};
		});

		if (exists) {
			socket.emit('userExists', "This username is already taken.");
		} else {
			people[socket.id] = {
				name: nickname.toLowerCase(),
				rooms: {}
			};
			username = nickname;
			sockets.push(socket);

			// TODO: Message everyone that a new user connected
			console.log(nickname + " joined the chat server");
			socket.emit('successfulJoin');

			socket.join('general');
			socket.broadcast.to('general').emit('newUser', {
				username: username,
				id: socket.id
			});
		};
	});

	socket.on('send', function(data) {
		console.log(people[socket.id].name + ": " + data.message);

		socket.broadcast.to('general').emit('chat', people[socket.id], data.message);
	});

	socket.on('disconnect', function() {
		sockets.splice(sockets.indexOf(socket), 1);
		delete people[socket.id];
		
		if (username !== "_nousr") { 
			socket.broadcast.to('general').emit('socketDisconnect', username);
			console.log(username + ' disconnected');
		} else {
			console.log(socket.id + ' (nousr) disconnected');
		}
	});
});
*/

app.use(function(req, res) {
	res.status(404).end('404 Not found');
});

// listen on port 8000 (for localhost) or the port defined for heroku
var port = process.env.PORT || 8000;
var ip = process.env.IP || 'localhost';
http.listen(port, ip, function() {
	console.log("Listening on *:8000");
});