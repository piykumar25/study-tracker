package com.piyush.userservice.service;

import com.piyush.userservice.dto.UserRequest;
import com.piyush.userservice.dto.UserResponse;

public interface UserService {
    UserResponse createUser(UserRequest userRequest);
}
