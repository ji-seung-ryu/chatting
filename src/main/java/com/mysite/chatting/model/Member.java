package com.mysite.chatting.model;

import java.util.UUID;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Member {
	private String name, userId;
	private statusType status;
	
	public enum statusType {
		ACTIVE, INACTIVE
	}
	public static Member create(String name) {
		Member member = new Member();
		member.name = name;
		member.userId = UUID.randomUUID().toString();
		member.status = statusType.ACTIVE;
		return member;
	}
	
}
