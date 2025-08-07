package com.piyush.authenticationservice.events;

import com.piyush.authenticationservice.enums.ROLE;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserRegisteredEvent {

    private Long id;
    private String username;
    private String email;
    private ROLE role;

}
