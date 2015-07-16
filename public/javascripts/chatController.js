// var socket; is initialized in chatroom.js, so we will build upon that
function initializeChat (nickname, room) {

  console.log("Joining room \"" + room + "\"...");

  $("#loading").fadeToggle('slow');

  setTimeout(function () {
    $("#main-wrapper").removeClass("container");
    $("#chat-app").fadeToggle('slow');
  }, 800);
};

// TODO: When client connects to the server -> join a room
// when a room is joined, add these to connected_rooms
// when the connection fails and the client needs to reconnect, connect to
// all rooms in the connected_rooms variable

socket.on('new message', function (message) {
  // TODO: Append message to chat window
});

socket.on('status message', function (message) {
  // TODO: Append a _server message_ to the chat window
  // These can be: disconnects, connects, server status
});

setInterval(function () {
  // TODO: Every x seconds, load the current user list
}, 5000);

$(".button-collapse").sideNav();
