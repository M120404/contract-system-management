package com.example.clientauth;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootTest
class ClientauthApplicationTests {
    private static final Logger logger = LoggerFactory.getLogger(ClientauthApplicationTests.class);

    @Test
    void contextLoads() {
        logger.info("Context loads test executed");
    }
}