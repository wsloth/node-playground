// TODO: When client connects to the server -> join a room
// when a room is joined, add these to connected_rooms
// when the connection fails and the client needs to reconnect, connect to
// all rooms in the connected_rooms variable
var connected = false;
var username;

var initializeChat = function(nickname) {
    username = nickname;
    console.log("Joining main room...");

    socket.emit('joinServer', nickname);
    connected = true;

    $("#loading").fadeToggle('slow');

    setTimeout(function() {
        $("#main-wrapper").removeClass("container");
        $("#chat-app").fadeToggle('slow');
        $(".button-collapse").sideNav();
    }, 800);
};

socket.on('chat', function(person, message) {
    newMessage(person, message);
});

socket.on('serverMessage', function(message) {
    // These can be: disconnects, connects, server status
    Materialize.toast(message, 10000);
});

socket.on('newUser', function(data) {
    statusMessage(data.username + ' (' + data.id + ') connected');
});
socket.on('socketDisconnect', function(id) {
    statusMessage(id + ' has disconnected');
});

socket.on('disconnect', function() {
   Materialize.toast('You have been disconnected', 10000);
   connected = false;
});

//setInterval(function() {
    // TODO: Every x seconds, load the current user list
//}, 5000);
