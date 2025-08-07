package com.piyush.userservice.listener;


import com.piyush.userservice.events.UserRegisteredEvent;
import com.piyush.userservice.model.User;
import com.piyush.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserRegistrationListener {

    private final UserRepository userRepository;

    @KafkaListener(topics = "user.registration.topic",
                groupId = "user-service",
            containerFactory = "userRegisteredEventConcurrentKafkaListenerContainerFactory"
    )
    public void handleUserRegisteredEvent(UserRegisteredEvent event) {

        if (event == null) {
            return;
        }

        if (userRepository.existsById(event.getId())) {
            return;
        }

        User user = User.builder()
                .id(event.getId())
                .username(event.getUsername())
                .email(event.getEmail())
                .role(event.getRole())
                .build();

        // save user to database
        userRepository.save(user);

    }
}
