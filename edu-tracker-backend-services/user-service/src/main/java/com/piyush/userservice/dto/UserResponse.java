package com.piyush.userservice.dto;

import com.piyush.userservice.enums.ROLE;
import com.piyush.userservice.enums.UserStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {

    private Long id;
    private  String email;
    private  String username;
    private ROLE role;
    private UserStatus status;
}
