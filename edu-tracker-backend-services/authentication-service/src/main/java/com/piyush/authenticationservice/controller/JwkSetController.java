package com.piyush.authenticationservice.controller;

import com.piyush.authenticationservice.utility.JWKSetHelper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.interfaces.RSAPublicKey;
import java.util.Map;

@RestController
@RequestMapping("/.well-known/jwks.json")
@RequiredArgsConstructor
public class JwkSetController {

    private final RSAPublicKey publicKey;

    @GetMapping
    public Map<String, Object> getJwks() {
        return JWKSetHelper.buildFromPublicKey(publicKey).toJSONObject();
    }

}
