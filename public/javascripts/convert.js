var pad = document.getElementById('pad');

var converter = new showdown.Converter();
var markdownArea = document.getElementById('markdown');

var convertTextAreaToMarkdown = function () {
  var markdownText = pad.value;
  html = converter.makeHtml(markdownText);
  markdownArea.innerHTML = html;
};

// Socket.io code
var socket = io();
var socketEmit = function () {
  socket.emit('pad change', pad.value);
};

socket.on('fresh pad', function (value) {
  pad.value = value;
  convertTextAreaToMarkdown();
});

// Markdown Converter
window.onload = function () {
  pad.addEventListener('input', convertTextAreaToMarkdown);
  pad.addEventListener('input', socketEmit);
};
