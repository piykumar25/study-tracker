package com.piyush.userservice.service;

import com.piyush.userservice.dto.LoginRequest;
import com.piyush.userservice.dto.UserRequest;
import com.piyush.userservice.dto.UserResponse;
import org.springframework.security.access.prepost.PreAuthorize;

public interface UserService {
    UserResponse createUser(UserRequest userRequest);

    UserResponse getUserAfterAuthentication(LoginRequest loginRequest);

    UserResponse getUser(Long id);
}
