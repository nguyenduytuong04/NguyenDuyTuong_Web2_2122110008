package com.nguyenduytuong.example05.service;

import java.util.List;

import com.nguyenduytuong.example05.entity.Chat;
import com.nguyenduytuong.example05.entity.User;
import com.nguyenduytuong.example05.payloads.ChatDTO;

public interface ChatService {
    ChatDTO saveChat(ChatDTO chatDTO);
    List<ChatDTO> getChatsByUser(Long userId);
}