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
    $("#preface-form-error").fadeToggle(2500);
  }
};

// Preface form submit
$("#preface-submit").click(function() {
  $("#preface").fadeToggle('slow');
  $("#loading").fadeToggle('slow');

  var nickname = $("#preface-nickname").val();

  if ((nickname == "") || (nickname === undefined)) {
    throwPrefaceFormValidationError();
    return;
  }

  socket = io('https://websocket-sandbox.herokuapp.com/chat');
  // http://localhost:8000/chat
  // https://websocket-sandbox.herokuapp.com/chat
  console.log("Chat sockets initialized");

  console.log('Loading scripts...');

  loadJS('/javascripts/chat/chatView.js', function() {});
  loadJS('//cdn.jsdelivr.net/emojione/1.4.1/lib/js/emojione.min.js', function() {});
  loadJS('/libs/textcomplete/jquery.textcomplete.min.js', function() {});
  loadJS('/javascripts/chat/chatEmoji.js', function() {});

  loadJS('/javascripts/chat/chatController.js', function() {
    $('head').append('<link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/1.4.1/assets/css/emojione.min.css"/>');
    $('head').append('<link rel="stylesheet" href="/libs/textcomplete/jquery.textcomplete.css"/>');

    console.log('All scripts loaded');
    initializeChat(nickname);
  });

});
