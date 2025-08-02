package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.dto.User;

public interface JwtService {

    String generateToken(User user);
}
