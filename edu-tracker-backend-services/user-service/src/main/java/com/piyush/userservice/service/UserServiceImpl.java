package com.piyush.userservice.service;

import com.piyush.userservice.dto.AuthenticationRequest;
import com.piyush.userservice.dto.UserRequest;
import com.piyush.userservice.dto.UserResponse;
import com.piyush.userservice.model.User;
import com.piyush.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest userRequest) {

        Optional<User> user = userRepository.findByEmail(userRequest.getEmail());

        if (user.isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User newUser = User.builder()
                .username(userRequest.getUsername())
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .role(userRequest.getRole())
                .build();

        User savedUser = userRepository.save(newUser);

        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .status(savedUser.getStatus())
                .build();
    }

    @Override
    public UserResponse getUserAfterAuthentication(AuthenticationRequest authenticationRequest) {
        User user = userRepository.findByUsername(authenticationRequest.getUsername()).orElse(null);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .build();

    }

    @Override
    public UserResponse getUser(Long id) {

        return userRepository.findById(id).map(user -> UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .status(user.getStatus())
                .build()).orElseThrow(() -> new RuntimeException("User not found"));

    }
}
