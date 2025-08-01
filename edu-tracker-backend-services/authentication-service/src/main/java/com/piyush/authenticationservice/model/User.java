package com.piyush.authenticationservice.model;

import com.piyush.authenticationservice.enums.ROLE;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(unique = true, nullable = false)
    public String username;

    @Column(unique = true, nullable = false)
    public String email;

    @Column(nullable = false)
    public String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public ROLE role;
}
