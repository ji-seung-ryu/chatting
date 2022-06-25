'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
//var board = document.querySelector('#board');

var stompClient = null;
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    username = document.querySelector('#name').value.trim();
	
	console.log (username);

    if(username) {
	alert('here');
        usernamePage.classList.add('hidden');
        var board = document.querySelector('#board');
        var userList = document.querySelector('#userList');

     //   board.classList.remove('hidden');
        userList.classList.remove('hidden');

        var socket = new SockJS('/javatechie');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}


function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/public', onMessageReceived);
    
    stompClient.subscribe('/topic/' + username, onMessageReceived);

    // Tell your username to the server
    
    stompClient.send("/app/chat.register",
        {},
        JSON.stringify({sender: username, receiver: username, type: 'JOIN'})
    )

	
	
    connectingElement.classList.add('hidden');
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function sendRequest(receiver){
	
	var o = {'title' : 'request'};
	
	if (stompClient){
		var chatMessage = {
			sender: username,
			content : JSON.stringify(o),
			type: 'CHAT',
			receiver: receiver
		}
		
		stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
	}
}
function sendRespond(receiver, ok){
	var o ={'title':'respond', 'ok': ok};
	if (stompClient){
		var chatMessage = {
			sender: username,
			content : JSON.stringify(o),
			type: 'CHAT',
			receiver: receiver
		}
		
		stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
	}
}

function send(event) {
  //  var messageContent = messageInput.value.trim();
	console.log (event);
	console.log (typeof(event));
	var e = new Object({"offsetX": event.offsetX, "offsetY": event.offsetY});
	
	console.log (e);
	
    if(stompClient) {
        var chatMessage = {
            sender: username,
            content: JSON.stringify(e),
            type: 'CHAT'
        };

        stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
       // messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log (message.type);

    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
        if (message.sender === username) setMember(message.members);
        else addMember(message.sender);
        alert(message.sender + 'joined!');
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
        deleteMember(message.sender);
        alert(message.sender + 'Leave..');
		
        
     
	
	} else {
		var content = JSON.parse(message.content);
		var ok = 0;
		if (content.title === 'request'){
			if (ok = confirm(message.sender + "와의 대국 하시겠습니까?")){
				sendRespond(message.sender, ok);
			}
			else sendRespond(message.sender, ok);
		} else if (content.title === 'respond'){
			if (content.ok){
				alert('대국장으로 이동!');
			} else{
				console.log ('싱대가 거절');
			}
			
		} else{
			console.log ('not request, respond');
		}
		
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
      //  put_stone(JSON.parse(message.content));

    }
	
    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }

    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function disConnect (){
	if(stompClient) {
        var leaveMessage = {
            sender: username,
            content: null,
            type: 'LEAVE'
        };

        stompClient.send("/app/chat.leave", {}, JSON.stringify(leaveMessage));
        stompClient.unsubscribe(); 
       // messageInput.value = '';
    }
	
}
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', send, true);
window.addEventListener('beforeunload',disConnect, true);