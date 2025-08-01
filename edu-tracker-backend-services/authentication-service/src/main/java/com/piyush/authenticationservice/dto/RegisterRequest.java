package com.piyush.authenticationservice.dto;

import com.piyush.authenticationservice.enums.ROLE;
import lombok.Data;

@Data
public class RegisterRequest {

    private String username;
    private String email;
    private String password;
    private ROLE role;

}
