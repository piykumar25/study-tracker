package com.piyush.userservice.model;

import com.piyush.userservice.enums.ROLE;
import com.piyush.userservice.enums.UserStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@Table(name = "users")
@AllArgsConstructor
@Builder
public class User {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true, nullable = false)
    public String username;

    @Column(unique = true, nullable = false)
    public String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public ROLE role;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    public UserStatus status = UserStatus.ACTIVE;
}

