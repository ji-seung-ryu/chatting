package com.mysite.chatting.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OmokRoom {

	private String roomId;
	private String roomName;
	private List <String> memberList = new ArrayList<String>();
	private String turn;

	
	
	
	public static OmokRoom create(String name) {
		OmokRoom room = new OmokRoom();
		room.roomId = UUID.randomUUID().toString();
		room.roomName = name;
		return room;
	}
	
	public List<String> enter(String username){
		if (memberList.isEmpty()) turn = username;
		
		if (!memberList.contains(username)) memberList.add(username);
		
		
		return memberList;
	}
}
