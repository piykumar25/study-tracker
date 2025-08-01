package com.piyush.authenticationservice.controller;

import com.piyush.authenticationservice.dto.AuthResponse;
import com.piyush.authenticationservice.dto.LoginRequest;
import com.piyush.authenticationservice.dto.RegisterRequest;
import com.piyush.authenticationservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody
            RegisterRequest registerRequest) {

        String jwt = userService.registerUser(registerRequest);
        return ResponseEntity.ok().body(jwt);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok().body(userService.loginUser(loginRequest));
    }


}


