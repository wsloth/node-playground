var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore')._;

var people = {};
var rooms = {};
var chatHistory = {
    'general': {}
}

var sockets = []; // All active connections

var chatHandler = function (socket) {
    
    var joined = false;
    var username;
    var inRooms = [];
    
    console.log('New user ' + socket.id + ' connected');
    
    /* Connectivity events
    ------------------------------------------------------------------------- */
    socket.on('joinServer', function (nickname) {
        var usernameExists = false;
        
        _.find(people, function (key, val) {
            if (key.name.toLowerCase() === nickname.toLowerCase()) {
                return usernameExists = true;
            }
        });
        
        if (!usernameExists) {
            username = nickname;
            sockets.push(socket); // Add socket to active connections
            
            socket.emit('successfulJoin'); // Send success message
            socket.join('general'); // Join the main channel
            inRooms.push('general');
            
            joined = true;
            
            socket.broadcast.to('general').emit('newUser', {
				username: username,
				id: socket.id
			});
        } else {
            socket.emit('userExists', 'This username is already taken.');
        }
    });
    
    socket.on('disconnect', function () {
        sockets.splice(sockets.indexOf(socket), 1);
        
        delete people[socket.id];
		
		if (joined) { 
			socket.broadcast.to('general').emit('socketDisconnect', username);
			console.log(username + ' disconnected');
		} else {
		    // When a socket that hasn't joiend the room disconnects
			console.log(socket.id + ' (nousr) disconnected');
		}
    });
    
    
    /* Chat events
    ------------------------------------------------------------------------- */
    socket.on('send', function (data) {
        console.log(username + ": " + data.message);

		socket.broadcast.to('general').emit('chat', username, data.message);
    });
};

module.exports = chatHandler;