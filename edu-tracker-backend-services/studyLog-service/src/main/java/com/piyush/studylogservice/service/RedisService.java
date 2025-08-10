package com.piyush.studylogservice.service;

public interface RedisService {

    <T> T get(String key, Class<T> clazz);

    <T> void set(String key, T value, Long ttl);
}
