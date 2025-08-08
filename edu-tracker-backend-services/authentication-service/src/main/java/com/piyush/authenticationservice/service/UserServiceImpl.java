package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.dto.AuthResponse;
import com.piyush.authenticationservice.dto.LoginRequest;
import com.piyush.authenticationservice.dto.RegisterRequest;
import com.piyush.authenticationservice.events.UserRegisteredEvent;
import com.piyush.authenticationservice.model.UserAuth;
import com.piyush.authenticationservice.repository.UserAuthRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final KafkaTemplate kafkaTemplate;
    @Value("${internal.secret}")
    private String internalSecret;

    private final JwtService jwtService;
    private final RestTemplate restTemplate;
    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String registerUser(RegisterRequest registerRequest) {

        userAuthRepository.findByUsername(registerRequest.getUsername())
                .ifPresent(user -> {
                    throw new RuntimeException("User already exists");
                });
        UserAuth userAuth = UserAuth.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .email(registerRequest.getEmail())
                .role(registerRequest.getRole())
                .build();

        UserAuth savedUser = userAuthRepository.save(userAuth);
        UserRegisteredEvent userRegisteredEvent = UserRegisteredEvent.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .id(savedUser.getId())
                .role(registerRequest.getRole())
                .build();

        kafkaTemplate.send("user.registration.topic", userRegisteredEvent);

        return jwtService.generateToken(userRegisteredEvent);
    }

    private HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-Secret", internalSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {
        UserAuth user = userAuthRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        UserRegisteredEvent userRegisteredEvent = UserRegisteredEvent.builder()
                .username(user.getUsername())
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

        String token = jwtService.generateToken(userRegisteredEvent);

        return new AuthResponse(token);
    }
}
