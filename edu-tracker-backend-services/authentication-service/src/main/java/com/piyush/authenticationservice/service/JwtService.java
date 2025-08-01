package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.model.User;

public interface JwtService {

    String generateToken(User user);
}
