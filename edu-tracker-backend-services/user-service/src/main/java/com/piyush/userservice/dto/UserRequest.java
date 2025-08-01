package com.piyush.userservice.dto;

import com.piyush.userservice.enums.ROLE;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRequest {

    private String username;
    private String email;
    private String password;
    private ROLE role;
}
