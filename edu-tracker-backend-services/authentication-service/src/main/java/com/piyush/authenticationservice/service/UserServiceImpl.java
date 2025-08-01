package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.dto.AuthResponse;
import com.piyush.authenticationservice.dto.LoginRequest;
import com.piyush.authenticationservice.dto.RegisterRequest;
import com.piyush.authenticationservice.model.User;
import com.piyush.authenticationservice.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public String registerUser(RegisterRequest registerRequest) {

        Optional<User> user = userRepository.findByEmail(registerRequest.getEmail());

        if (user.isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User newUser = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .build();
        User savedUser = userRepository.save(newUser);
        return jwtService.generateToken(savedUser);
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
