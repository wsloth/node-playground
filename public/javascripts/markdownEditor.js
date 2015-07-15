var pad = document.getElementById('pad');
var converter = new showdown.Converter();
var markdownArea = document.getElementById('markdown');
var previousMarkdownValue = '';
// TODO: Change URL to website URL
var socket = io('https://guarded-caverns-6433.herokuapp.com/markdown');
var room = window.location.href.split("/").pop();
socket.emit('mdroom', room);

var convertTextAreaToMarkdown = function(){
    var markdownText = pad.value;
    previousMarkdownValue = markdownText;
    html = converter.makeHtml(markdownText);
    markdownArea.innerHTML = html;
};

var didChangeOccur = function(){
    if (previousMarkdownValue != pad.value) {
        return true;
    };
    return false;
};

// Every 100ms, check for changes
setInterval(function(){
    if(didChangeOccur()){
        // If changes occured, convert & send
        convertTextAreaToMarkdown();
        socketEmit();
    };
}, 100);


/* Socket.io code */
// On local change, send pad
var socketEmit = function () {
  socket.emit('pad change', {room: room, pad: pad.value});
};

// On server change, update pad
socket.on('fresh pad', function (value) {
  pad.value = value;
  convertTextAreaToMarkdown();
});

socket.on('userlist', function (list) {
  var userlist = document.getElementById('userList');
  userlist.innerHTML = '';
  jQuery.each(list.users, function (key, val) {
    if (key == list.you) {
      userlist.innerHTML += key = "<li><b>" + key + "</b> (you)</li>";
    } else {
      userlist.innerHTML += "<li>" + key + "</li>";
    }
  });
});

setInterval(function() {
  socket.emit('refresh', room);
}, 5000);
