package com.piyush.authenticationservice.dto;

import com.piyush.authenticationservice.enums.ROLE;
import lombok.Data;

@Data
public class User {

    public Long id;

    public String username;

    public String email;

    public String password;

    public ROLE role;

    public UserStatus status = UserStatus.ACTIVE;
}
