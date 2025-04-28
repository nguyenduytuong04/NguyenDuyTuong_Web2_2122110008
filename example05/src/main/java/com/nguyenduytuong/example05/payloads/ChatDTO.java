package com.nguyenduytuong.example05.payloads;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatDTO {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String message;
    private LocalDateTime createdAt;
}   