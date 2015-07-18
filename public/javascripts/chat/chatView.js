var chatWindow = $('#chat-view');
var lastSender;

function scrollToBottom() {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}

/* Chat message handling
----------------------------------------------------------------------------- */
function addChatMessageToView(username, message) {
	message = messageParser(message);
	
	if (lastSender != username) {
		var messageTemplate = document.querySelector('#newMessage').content;
		
		messageTemplate.querySelector('.info-user').textContent = username;
		
		var cdate = new Date();
		
		var currentTime = cdate.getHours() + ':' + cdate.getMinutes();
		messageTemplate.querySelector('.info-time').textContent = currentTime;
		
		messageTemplate.querySelector('.message-body').innerHTML = message;
			
		lastSender = username;
	} else {
		var messageTemplate = document.querySelector('#threadMessage').content;
		messageTemplate.querySelector('.message-body').innerHTML = message;
	}
	
	document.querySelector('#chat-view').appendChild(
		document.importNode(messageTemplate, true));
}

function messageParser (message) { // Covert emoji and URLs into HTML
	message = Autolinker.link(message);
	message = emojione.toImage(message);
	
	return message;
}
// Show different kinds of messages
function statusMessage (message) {
	message = messageParser('<p class="status-message"><b>' + message + '</b></p>');
	chatWindow.append(message);
	scrollToBottom();
}
function localMessage (message) {
	message = messageParser(message);
	chatWindow.append(message);
	scrollToBottom();
}


/* Other stuff
----------------------------------------------------------------------------- */
$('#chat-input').keypress(function (e) { // User sends a message
  if (e.which == 13) {
	var message = $('#chat-input');
	if ((message.val() != "") && (message.val() !== undefined)) {

		addChatMessageToView(username, message.val());

		socket.emit('send', {room: 'general', message: message.val()});
		message.val('');
	}
	return false;
  }
});

function fieldFocus() { // On softkeyboard.open, scroll the view to bottom
  if (isAndroid()) {
	scrollToBottom();
  }
}

function isAndroid() { // Check if the user agent is chrome for android
  var ua = navigator.userAgent.toLowerCase();
  var android = ua.indexOf("android") > -1;
  if (android) {
	return true;
  }
  return false;
}

$().ready(function () { // Mobile "cookie" for showing a dialog on first visit
  if (Modernizr.localstorage) {
	  if (isAndroid()) {
		  if (!localStorage['alreadyVisited']) {
			 localStorage['alreadyVisited'] = 'yes';
			 Materialize.toast('Tip: Add the website to your homescreen!', 10000);
		 }
	  }
  }
});
