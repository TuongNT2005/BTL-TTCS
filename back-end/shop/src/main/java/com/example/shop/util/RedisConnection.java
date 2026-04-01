package com.example.shop.util;

import io.lettuce.core.*;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.api.sync.RedisCommands;

public class RedisConnection {

        static final RedisClient client;
        static final StatefulRedisConnection<String, String> connection;

        static {
                RedisURI uri = RedisURI.Builder
                                .redis("redis-14570.c12.us-east-1-4.ec2.cloud.redislabs.com", 14570)
                                .withAuthentication("default", "d2oRLMEvj1J62o1sndSii47HBjVei6jm")
                                .build();
                client = RedisClient.create(uri);
                connection = client.connect();
        }

        public static void saveToRedis(String key, String val, Long ttlInSeconds) {
                RedisCommands<String, String> commands = connection.sync();
                commands.setex(key, ttlInSeconds, val);
        }

        public static Boolean isInRedis(String key) {
                RedisCommands<String, String> commands = connection.sync();
                return commands.get(key) == null ? false : true; 
        }
}
