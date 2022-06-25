'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null;

var colors = [
	'#2196F3', '#32c787', '#00BCD4', '#ff5652',
	'#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect() {
	if (username) {
		var socket = new SockJS('/javatechie');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, onConnected, onError);
	}

}


function onConnected() {
	stompClient.subscribe('/topic/public', onMessageReceived);
	stompClient.subscribe('/topic/' + username, onMessageReceived);

	// Tell your username to the server


	stompClient.send("/app/chat.register",
		{},
		JSON.stringify({ sender: username, receiver: username, type: 'JOIN' })
	)

}


function onError(error) {
	connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
	connectingElement.style.color = 'red';
}

function sendRequest(receiver) {

	var o = { 'title': 'request' };

	if (stompClient) {
		var chatMessage = {
			sender: username,
			content: JSON.stringify(o),
			type: 'CHAT',
			receiver: receiver
		}

		stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
	}
}
function sendRespond(receiver, ok) {
	var o = { 'title': 'respond', 'ok': ok };
	if (stompClient) {
		var chatMessage = {
			sender: username,
			content: JSON.stringify(o),
			type: 'CHAT',
			receiver: receiver
		}

		stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));
	}
}

function sendRoomId(receiver, roomId) {
	alert('sendRoomId');
	var o = { 'title': 'roomId', 'roomId': roomId };
	if (stompClient) {
		var chatMessage = {
			sender: username,
			content: JSON.stringify(o),
			type: 'CHAT',
			receiver: receiver
		}

		stompClient.send("/app/chat.send", {}, JSON.stringify(chatMessage));

	}
}



function statusChange() {
	axios.post(location.href)
		.then(
			response => {
				alert(response);

			}
		)
		.catch(response => { alert(response); });
}
function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);


	if (message.type === 'JOIN') {
		if (message.sender !== username) addMember(message.sender);
		message.content = message.sender + ' joined!';

		//	if (message.sender === username) setMember(message.members);
		//else addMember(message.sender);
	} else if (message.type === 'LEAVE') {
		//	deleteMember(message.sender);




	} else {
		var content = JSON.parse(message.content);
		var ok = 1;
		if (content.title === 'request') {
			console.log('get request');
			// confirm 대체 품목.. 
			if (ok) {
				sendRespond(message.sender, ok);
			}
			else sendRespond(message.sender, ok);
		} else if (content.title === 'respond') {
			if (content.ok) {
				console.log('create the room..');
				// create the room;
				var params = new URLSearchParams();
				params.append("name", username);
				axios.post('/omok/create', params)
					.then(
						response => {
							alert(response.data.roomName + "방 개설에 성공하였습니다.")
							console.log(response.data.roomId);
							sendRoomId(message.sender, response.data.roomId);
							statusChange();
							location.href = `/omok/room/enter/${response.data.roomId}?username=${username}`;
						}
					)
					.catch(response => { alert(response); });

			} else {
				console.log('싱대가 거절');
			}

		} else if (content.title === 'roomId') {
			statusChange();
			location.href = `/omok/room/enter/${content.roomId}?username=${username}`;
		} else {
			console.log('not request, respond');
		}



	}


}


function disConnect() {
	if (stompClient) {
		var leaveMessage = {
			sender: username,
			content: null,
			type: 'LEAVE'
		};

		stompClient.send("/app/chat.leave", {}, JSON.stringify(leaveMessage));
		stompClient.unsubscribe();
	}

}

connect();
//window.addEventListener('beforeunload', disConnect, true);