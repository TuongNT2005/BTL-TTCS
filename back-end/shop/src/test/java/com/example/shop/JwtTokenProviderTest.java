package com.example.shop;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.example.shop.security.JwtTokenProvider;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secret = "test-secret-key-that-is-at-least-256-bits-long-for-testing-purpose-only-123456";

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secret);
    }

    @Test
    void testGenerateAndValidateAccessToken() {
        String token = jwtTokenProvider.generateAccessToken(10, "john_doe", "ROLE_USER");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(10, jwtTokenProvider.getUserIdFromToken(token));
        assertEquals("john_doe", jwtTokenProvider.getUsernameFromToken(token));
        assertEquals("ROLE_USER", jwtTokenProvider.getRoleFromToken(token));
    }

    @Test
    void testGenerateAndValidateRefreshToken() {
        String token = jwtTokenProvider.generateRefreshToken(20, "admin_user");
        assertNotNull(token);
        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(20, jwtTokenProvider.getUserIdFromToken(token));
        assertEquals("admin_user", jwtTokenProvider.getUsernameFromToken(token));
    }

    @Test
    void testValidateInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.token.here"));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken(null));
    }

    @Test
    void testTokenSignedWithDifferentSecretFails() {
        JwtTokenProvider otherProvider = new JwtTokenProvider("another-different-very-long-secret-key-for-testing-only-123456789");
        String token = otherProvider.generateAccessToken(5, "user5", "ROLE_ADMIN");
        assertFalse(jwtTokenProvider.validateToken(token));
    }
}

