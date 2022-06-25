package com.mysite.chatting.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mysite.chatting.model.Member;
import com.mysite.chatting.model.OmokMessage;
import com.mysite.chatting.model.OmokRoom;
import com.mysite.chatting.service.OmokService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/omok")
@Controller
@RequiredArgsConstructor
public class OmokController {
	private final OmokService omokService;
	private final SimpMessagingTemplate simpMessagingTemplate;	

	@MessageMapping("/omok.register")
	@SendTo("/topic/omok")
	public void register(@Payload OmokMessage omokMessage, SimpMessageHeaderAccessor headerAccessor) {
	
		headerAccessor.getSessionAttributes().put("username", omokMessage.getSender());
		omokMessage.setMembers(omokService.roomInfo(omokMessage.getRoomId()));
		simpMessagingTemplate.convertAndSend("/topic/omok/"+ omokMessage.getRoomId(), omokMessage);

	//	members.add(chatMessage.getSender());
	//	chatMessage.setMembers(members);
		
	}
	
	@MessageMapping("/omok.put")
	@SendTo("topic/omok")
	public void sendMessage(@Payload OmokMessage omokMessage) {
 		omokMessage.setMembers(omokService.roomInfo(omokMessage.getRoomId()));
		simpMessagingTemplate.convertAndSend("/topic/omok/"+ omokMessage.getRoomId(), omokMessage);
	//	return chatMessage;
	}
	
    // 모든 채팅방 목록 반환
    @GetMapping("/rooms")
    @ResponseBody
    public List<OmokRoom> room() {
        return omokService.findAllRoom();
    }
    // 채팅방 생성
    @PostMapping("/create")
    @ResponseBody
    public OmokRoom createRoom(@RequestParam String name) {
        return omokService.createRoom(name);
    }
    // 채팅방 입장 화면
    @GetMapping("/room/enter/{roomId}")
    public String roomDetail(Model model, @PathVariable String roomId  , @RequestParam String username) {
    	List <String> memberList = omokService.enterRoomById(roomId, username);
    	if (memberList.size() == 2) {
    		model.addAttribute("opponent", memberList.get(0));
    		System.out.println(username+"의 적은 "+memberList.get(0));
    	}
    	else model.addAttribute("opponent", null);
    	
    	model.addAttribute("username", username);
    	model.addAttribute("memberList", memberList);
        model.addAttribute("omokRoomId", roomId);
        return "omok";
    }
    // 특정 채팅방 조회
    @GetMapping("/room/{roomId}")
    @ResponseBody
    public OmokRoom roomInfo(@PathVariable String roomId) {
        return omokService.findById(roomId);
    }
}
