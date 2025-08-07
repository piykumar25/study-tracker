package com.piyush.userservice.events;

import com.piyush.userservice.enums.ROLE;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class UserRegisteredEvent {

    private Long id;
    private String username;
    private String email;
    private ROLE role;

}
