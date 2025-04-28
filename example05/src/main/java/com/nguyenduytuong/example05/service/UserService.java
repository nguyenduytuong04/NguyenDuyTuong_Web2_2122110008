package com.nguyenduytuong.example05.service;

import com.nguyenduytuong.example05.payloads.UserDTO;
import com.nguyenduytuong.example05.payloads.UserReponse;

public interface UserService {
    UserDTO registerUser(UserDTO userDTO);

    UserReponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserDTO getUserById(Long userId);

    UserDTO updateUser(Long userId, UserDTO userDTO);

    String deleteUser(Long userId);

    UserDTO getUserByEmail(String email);

}
