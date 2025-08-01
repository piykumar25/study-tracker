package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.dto.AuthResponse;
import com.piyush.authenticationservice.dto.LoginRequest;
import com.piyush.authenticationservice.dto.RegisterRequest;

public interface UserService {

    String registerUser(RegisterRequest registerRequest);

    AuthResponse loginUser(LoginRequest loginRequest);
}
