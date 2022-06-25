var stompClient = null;

function connect() {
	if (username) {
		var socket = new SockJS('/javatechie');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, onConnected, onError);
	}

}

function onConnected() {
	stompClient.subscribe('/topic/omok/' + omokRoomId , onMessageReceived);
	stompClient.subscribe('/topic/omok/' + username, onMessageReceived);

	// Tell your username to the server


	stompClient.send("/app/omok.register",
		{},
		JSON.stringify({ sender: username, receiver: username, roomId: omokRoomId, type: 'JOIN' })
	)

}

function onError(error) {
	connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
	connectingElement.style.color = 'red';
}

function send(event) {
	//  var messageContent = messageInput.value.trim();
	var o = new Object({ "offsetX": event.offsetX, "offsetY": event.offsetY });


	if (stompClient) {
		var chatMessage = {
			sender: username,
			receiver: opponent,
			roomId: omokRoomId,
			content: JSON.stringify(o),
			type: 'PUT'
		};

		stompClient.send("/app/omok.put", {}, JSON.stringify(chatMessage));
		// messageInput.value = '';
	}
}

function onMessageReceived(payload) {
	var message = JSON.parse(payload.body);


	if (message.type === 'JOIN') {
		if (message.sender != username) opponent = message.sender; 
		
		if (message.members[0] == username) myTurn = 1;
		else myTurn = 0; 
		
		if (myTurn) alert(username+ "님이 흑입니다.");
		else alert(username+"님이 백입니다.");
		
		message.members.forEach((member) =>{
			if (member != username) opponent = member;
		} )
	} else if (message.type === 'LEAVE') {
		//	deleteMember(message.sender);

	} else if (message.type === 'PUT'){
		var content = JSON.parse(message.content);
		if (message.sender != username) draw_stone(content);		



	}


}

connect();