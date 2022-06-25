package com.mysite.chatting.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Service;

import com.mysite.chatting.model.Member;
import com.mysite.chatting.model.Member.statusType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MemberService {
	private Map<String, Member> members;

	@PostConstruct
	private void init() {
		members = new LinkedHashMap<>();
	}

	public List<Member> findAllMember(){
		List<Member> result = new ArrayList<>(members.values());
		return result;
	}
	
	public Member findById(String userId ) {
		return members.get(userId);
	}
	
	public Member changeStatusById (String userId, statusType change) {
		Member member = findById(userId);
		member.setStatus(change);
		return member;
	}
	
	public Member createMember(String name) {
		Member member = Member.create(name);
		members.put(member.getUserId(), member);
		System.out.println(member.getUserId());
		return member;
	}
}