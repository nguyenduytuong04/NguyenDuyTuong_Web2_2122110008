    package com.nguyenduytuong.example05.service.impl;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;

import com.nguyenduytuong.example05.entity.Chat;
import com.nguyenduytuong.example05.entity.User;
import com.nguyenduytuong.example05.payloads.ChatDTO;
import com.nguyenduytuong.example05.repository.ChatRepository;
import com.nguyenduytuong.example05.service.ChatService;

import lombok.RequiredArgsConstructor;
    import java.util.List;
    import java.util.stream.Collectors;


    @Service
    public class ChatServiceImpl implements ChatService {
        @Autowired
        private ChatRepository chatRepository;
        
        public ChatDTO saveChat(ChatDTO chatDTO) {
            Chat chat = new Chat();
            chat.setSender(new User(chatDTO.getSenderId()));
            chat.setReceiver(new User(chatDTO.getReceiverId()));
            chat.setMessage(chatDTO.getMessage());
            chat.setCreatedAt(chatDTO.getCreatedAt());
            chat = chatRepository.save(chat);
            return new ChatDTO(chat.getId(), chat.getSender().getUserId(), chat.getReceiver().getUserId(), chat.getMessage(), chat.getCreatedAt());
        }
        
        public List<ChatDTO> getChatsByUser(Long userId) {
            return chatRepository.findBySender_UserIdOrReceiver_UserId(userId, userId)
                    .stream()
                    .map(chat -> new ChatDTO(chat.getId(), chat.getSender().getUserId(), chat.getReceiver().getUserId(), chat.getMessage(), chat.getCreatedAt()))
                    .collect(Collectors.toList());
        }
    }