package com.piyush.authenticationservice.repository;

import com.piyush.authenticationservice.model.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth,Long> {

    Optional<UserAuth> findByUsername(String username);
}
