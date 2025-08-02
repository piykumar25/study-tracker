package com.piyush.authenticationservice.service;

import com.nimbusds.jose.jwk.source.JWKSource;
import com.piyush.authenticationservice.dto.User;
import com.piyush.authenticationservice.utility.JWKSetHelper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements  JwtService {

    @Value("${jwt.expiration}")
    private long jwtExpirationMillis;

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.private-key}")
    private Resource privateKeyResource;

    private JwtEncoder jwtEncoder;

    @PostConstruct
    public void init() {
        try {
            RSAPrivateKey privateKey = loadPrivateKey();
            JWKSource<com.nimbusds.jose.proc.SecurityContext> jwkSource =
                    (jwkSelector, context) -> jwkSelector.select(
                            JWKSetHelper.buildFromPrivateKey(privateKey)
                    );
            jwtEncoder = new NimbusJwtEncoder(jwkSource);
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to initialize JwtService", ex);
        }
    }

    @Override
    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plusMillis(jwtExpirationMillis);

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .issuedAt(now)
                .expiresAt(expiry)
                .subject(user.getEmail())
                .claim("role", user.getRole())
                .claim("userId", user.getId())
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    private RSAPrivateKey loadPrivateKey() {
        try (InputStream inputStream = privateKeyResource.getInputStream()) {
            byte[] keyBytes = inputStream.readAllBytes();
            String privateKeyPEM = new String(keyBytes)
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replace("-----BEGIN RSA PRIVATE KEY-----", "")
                    .replace("-----END RSA PRIVATE KEY-----", "")
                    .replaceAll("\\s+", "");

            byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);
            PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(decoded);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            PrivateKey privateKey = keyFactory.generatePrivate(spec);
            return (RSAPrivateKey) privateKey;
        } catch (Exception e) {
            throw new IllegalStateException("Failed to load RSA private key", e);
        }
    }

}
