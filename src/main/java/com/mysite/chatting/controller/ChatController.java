package com.mysite.chatting.controller;

import java.util.Vector;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import com.mysite.chatting.model.ChatMessage;

import lombok.NonNull;
import lombok.Setter;
import lombok.RequiredArgsConstructor;

import com.mysite.chatting.service.ChatService;

@Controller
@RequiredArgsConstructor
public class ChatController {

	private final SimpMessagingTemplate simpMessagingTemplate;	
	private Vector<String> members = new Vector<String>();  
	
	@MessageMapping("/chat.register")
	@SendTo("/topic/public")
	public ChatMessage register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
	
		headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
		members.add(chatMessage.getSender());
		chatMessage.setMembers(members);
		
		return chatMessage;
	}

	@MessageMapping("/chat.send")
	@SendTo("/topic/public")
	public void sendMessage(@Payload ChatMessage chatMessage) {
		simpMessagingTemplate.convertAndSend("/topic/"+ chatMessage.getReceiver(), chatMessage);
	//	return chatMessage;
	}

	@MessageMapping("/chat.leave")
	@SendTo("/topic/public")
	public ChatMessage leave(@Payload ChatMessage chatMessage) {
		
		members.remove(chatMessage.getSender());
		chatMessage.setMembers(members);
		
		System.out.println("leave call!");
		return chatMessage;
	}

	@MessageMapping("/chat.mail")
	@SendTo ("/topic/roomId")
	public ChatMessage sendMail(@Payload ChatMessage chatMessage) {
		
		System.out.println("sendMail!");
		return chatMessage;
	}
	
	
	@GetMapping("/omok")
	public String omok() {
		return "omok";
	}
}