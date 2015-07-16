var connected_rooms = {};
var username;

var socket;


// Asynchronously load new javascripts
function loadJS(src, callback) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onreadystatechange = s.onload = function() {
        var state = s.readyState;
        if (!callback.done && (!state || /loaded|complete/.test(state))) {
            callback.done = true;
            callback();
        }
    };
    document.getElementsByTagName('head')[0].appendChild(s);
}

function throwPrefaceFormValidationError () {
  $("#loading").fadeToggle('slow');
  $("#preface").fadeToggle('slow');

  if (!$("#preface-form-error").is(":visible")) {
    $("#preface-form-error").fadeToggle(2500);;
  }
};

// Preface form submit
$("#preface-submit").click(function() {
  $("#preface").fadeToggle('slow');
  $("#loading").fadeToggle('slow');

  var nickname = $("#preface-nickname").val();
  var room = $("#preface-room-name").val();

  if ((nickname == "") || (room == "") || (nickname === undefined) || (room === undefined)) {
    throwPrefaceFormValidationError();
    return;
  }

  loadJS('/javascripts/chatController.js', function() {
      initializeChat(nickname, room);
  });

  socket = io('http://localhost:8000/chat');
  console.log("Chat sockets initialized..");
});
