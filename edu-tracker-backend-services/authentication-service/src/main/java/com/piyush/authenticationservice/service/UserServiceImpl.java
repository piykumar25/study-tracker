package com.piyush.authenticationservice.service;

import com.piyush.authenticationservice.dto.AuthResponse;
import com.piyush.authenticationservice.dto.LoginRequest;
import com.piyush.authenticationservice.dto.RegisterRequest;
import com.piyush.authenticationservice.dto.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    @Value("${internal.secret}")
    private String internalSecret;

    private final JwtService jwtService;
    private final RestTemplate restTemplate;

    @Override
    public String registerUser(RegisterRequest registerRequest) {

        HttpHeaders headers = getHttpHeaders();

        HttpEntity<RegisterRequest> request = new HttpEntity<>(registerRequest, headers);
        User savedUser = null;
        try {
            savedUser = restTemplate.postForObject("http://localhost:8082/api/v1/internal/user", request, User.class);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return jwtService.generateToken(savedUser);
    }

    private HttpHeaders getHttpHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-Secret", internalSecret);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    @Override
    public AuthResponse loginUser(LoginRequest loginRequest) {
        HttpHeaders headers = getHttpHeaders();

        User user = null;
        try {
            user = restTemplate
                    .exchange("http://localhost:8082/api/v1/internal/user", HttpMethod.GET,
                            new HttpEntity<>(loginRequest, headers), User.class).getBody();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
