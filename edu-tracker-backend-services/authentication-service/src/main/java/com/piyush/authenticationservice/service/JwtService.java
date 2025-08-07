package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.dto.User;
import com.piyush.authenticationservice.events.UserRegisteredEvent;

public interface JwtService {

    String generateToken(UserRegisteredEvent user);
}
