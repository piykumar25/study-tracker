package com.piyush.studylogservice.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableCaching
public class RedisCacheConfig {

    @Bean
    public RedisCacheConfiguration redisCacheConfiguration() {
        var serializer = new GenericJackson2JsonRedisSerializer();
        return RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer))
                .disableCachingNullValues()
                .computePrefixWith(name -> "studytracker::" + name + "::")
                .entryTtl(Duration.ofMinutes(10));
    }

    @Bean
    @Primary
    public CacheManager cacheManager(RedisConnectionFactory cf) {
        var base = redisCacheConfiguration();
        Map<String, RedisCacheConfiguration> cfg = new HashMap<>();
        cfg.put("studyLogsByUser", base.entryTtl(Duration.ofMinutes(5)));
        return RedisCacheManager.builder(cf)
                .cacheDefaults(base)
                .withInitialCacheConfigurations(cfg)
                .transactionAware()
                .build();
    }

    // Optional: jitter to avoid stampedes (±10% of TTL)
    @Bean
    public CacheManager jitteredCacheManager(RedisConnectionFactory cf) {
        return cacheManager(cf); // keep simple unless you need jitter
    }
}
