package com.piyush.userservice.service;

import com.piyush.userservice.dto.AuthenticationRequest;
import com.piyush.userservice.dto.UserRequest;
import com.piyush.userservice.dto.UserResponse;

public interface UserService {
    UserResponse createUser(UserRequest userRequest);

    UserResponse getUserAfterAuthentication(AuthenticationRequest authenticationRequest);

    UserResponse getUser(Long id);
}
