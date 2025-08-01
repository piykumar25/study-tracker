package com.piyush.authenticationservice.utility;

import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.JWKSet;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Collections;

public class JWKSetHelper {

    public static JWKSet buildFromPrivateKey(RSAPrivateKey privateKey) {
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPublicKeySpec publicSpec = new RSAPublicKeySpec(
                    privateKey.getModulus(),
                    BigInteger.valueOf(65537)
            );

            RSAPublicKey publicKey = (RSAPublicKey) keyFactory.generatePublic(publicSpec);

            RSAKey rsaKey = new RSAKey.Builder(publicKey)
                    .privateKey(privateKey)
                    .keyID("auth-service-key")
                    .build();

            return new JWKSet(Collections.singletonList(rsaKey));
        } catch (Exception e) {
            throw new IllegalStateException("Failed to build JWKSet from RSA private key", e);
        }
    }
}
