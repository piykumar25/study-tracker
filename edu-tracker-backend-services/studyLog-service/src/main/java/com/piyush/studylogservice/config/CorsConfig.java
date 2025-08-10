package com.piyush.studylogservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var c = new CorsConfiguration();
        c.setAllowedOrigins(List.of("http://localhost:5173")); // exact origin (needed if credentials)
        c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")); // add OPTIONS
        c.setAllowedHeaders(List.of("*")); // Authorization, Accept, etc.
        c.setAllowCredentials(true);       // if you’ll send cookies with SSE (EventSource {withCredentials:true})
        // optional: expose content-type (handy for debugging)
        c.setExposedHeaders(List.of("Content-Type"));

        var s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }
}
