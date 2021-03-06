// TODO: When client connects to the server -> join a room
// when a room is joined, add these to connected_rooms
// when the connection fails and the client needs to reconnect, connect to
// all rooms in the connected_rooms variable
var connected = false;
var isDisconnected = false;
var reconnecting = false;
var username;
var users = {};

var initializeChat = function(nickname) {
    username = nickname;
    console.log("Joining main room...");

    socket.emit('joinServer', nickname);
};

function finalizeChat() {
    $("#loading").fadeToggle('slow');
    
    connected = true;

    setTimeout(function() {
        $("#main-wrapper").removeClass("container");
        $("#chat-app").fadeToggle('slow');
        $(".button-collapse").sideNav();
    }, 800);
    
    statusMessage('You have connected to the server');
}

socket.on('successfulJoin', function (data) {
    console.log('Successfully connected to server');
    if ((!isDisconnected) && (!reconnecting)) {
        finalizeChat();
    } else {
        isDisconnected = false;
    }
});

socket.on('connection', function () {
   console.log('Socket connection initiated');
});

socket.on('userExists', function (message) {
    console.log('User already exists');
    // TODO: Handle error in preface
    // (Make a reverse-initialization func where all the steps are reversed)
});

socket.on('chat', function(username, message) {
    addChatMessageToView(username, message);
});

socket.on('serverMessage', function(message) {
    // These can be: disconnects, connects, server status
    Materialize.toast(message, 10000);
});

socket.on('newUser', function(data) {
    statusMessage(data.username + ' connected');
    users[data.id] = data.username;
});
socket.on('socketDisconnect', function(username) {
    statusMessage(username + ' has disconnected');
});

socket.on('disconnect', function() {
   connected = false;
   isDisconnected = true;
   reconnect()
});

function reconnect () {
    Materialize.toast('You have been disconnected. Reconnecting...', 5000);
    var timer = 5000;
    var times = 1;
    reconnecting = true;
    
    var reconnectLoop = function () {
        console.log(interval);
        if (!isDisconnected) {
            statusMessage('Reconnected to server');
            clearInterval(interval);
            reconnecting = false;
            
            for (var i = 1; i < 5000; i++) {
                window.clearInterval(i);
            }
        } else if (times > 30) {
            for (var i = 1; i < 5000; i++) {
                window.clearInterval(i);
            }
        } else {
            if (isDisconnected) {
                console.log('Emitting joinserver command...');
                socket.emit('joinServer', username);
            }
            
            statusMessage('Reconnecting... Try ' + times);
            times++;
            timer *= 1.5;
            
            interval = setInterval(reconnectLoop, timer);
        }
    };
    
    console.log('Setting interval...');
    var interval = setInterval(reconnectLoop(), timer);
    
};
