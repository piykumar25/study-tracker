package com.piyush.userservice.controller;

import com.piyush.userservice.dto.LoginRequest;
import com.piyush.userservice.dto.UserRequest;
import com.piyush.userservice.dto.UserResponse;
import com.piyush.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/internal/user")
@RequiredArgsConstructor
public class InternalUserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest userRequest) {

        return ResponseEntity.ok().body(userService.createUser(userRequest));

    }
}
