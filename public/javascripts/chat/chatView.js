var chatWindow = $('#chat-view');

// Show different kinds of messages
function newMessage (person, message) {
    chatWindow.append("<p class='message'>" + person.name + ": " + message + "</p>");
    loadEmoji();
}
function statusMessage (message) {
    chatWindow.append('<p class="message"><b>' + message + '</b></p>');
    loadEmoji();
}
function localMessage (message) {
    chatWindow.append(message);
    loadEmoji();
}

// User sends a message
$('#chat-input').keypress(function (e) {
  if (e.which == 13) {
    var message = $('#chat-input');
    if ((message.val() != "") && (message.val() !== undefined)) {

        localMessage('<p class="local-message message"><span class="username">' + username + '</span>: ' + message.val() + '</p>');

        socket.emit('send', {room: 'general', message: message.val()});
        message.val('');
    }
    return false;
  }
});

function loadEmoji () {
  $(".message").each(function() {
      var original = $(this).html();
      var converted = emojione.shortnameToImage(original);
      $(this).html(converted);
  });

  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}
