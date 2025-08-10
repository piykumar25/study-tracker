package com.piyush.studylogservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements  RedisService {

    private final RedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;


    @Override
    public <T> T get(String key, Class<T> clazz) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) return null;
            return objectMapper.readValue(value.toString(), clazz);
        } catch (Exception e) {
            return  null;
        }
    }

    @Override
    public <T> void set(String key, T value, Long ttl) {
        try {
            if (key == null || value == null) return;

            String json = objectMapper.writeValueAsString(value);
            redisTemplate.opsForValue().set(key, json, ttl, TimeUnit.SECONDS);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

}
