package com.example.shop.service;


import java.text.ParseException;
import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.shop.entity.User;
import com.example.shop.util.RedisConnection;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.KeyLengthException;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;



@Service
public class JwtService {

    @Value("${app.jwt.secretKey}")
    private String secretKey;

    public String generateAccessToken(User user) {

        Date issueTime = new Date();
        Date expirationTime = Date.from(issueTime.toInstant().plusSeconds(30 * 60));

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getUsername())
            .issueTime(issueTime)
            .jwtID(UUID.randomUUID().toString())
            .expirationTime(expirationTime)
            .claim("userId", user.getId())
            .claim("scp", user.getRole().toString())
            .build();
        
        Payload payload = new Payload(claimsSet.toJSONObject());

        // JWS = Json Webtoken Signature
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (KeyLengthException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (JOSEException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return jwsObject.serialize();
    }

    public String generateRefreshToken(User user) {

        Date issueTime = new Date();
        Date expirationTime = Date.from(issueTime.toInstant().plusSeconds(60 * 60 * 24));

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        
        System.out.println(user.getRole().toString());

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getUsername())
            .issueTime(issueTime)
            .jwtID(UUID.randomUUID().toString())
            .expirationTime(expirationTime)
            .claim("msg", "Hello world")
            .claim("userId", user.getId())
            .claim("scp", user.getRole().toString())
            .build();
        
        Payload payload = new Payload(claimsSet.toJSONObject());

        // JWS = Json Webtoken Signature
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(secretKey));
        } catch (KeyLengthException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (JOSEException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        return jwsObject.serialize();
    }

    public Boolean verifyToken(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        // Lấy thời gian hết hạn ra khỏi token
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        // Kiểm tra token có còn hiệu lực hay không
        if(expirationTime.before(new Date())) {
            return false;
        }
        String tokenId = (String) signedJWT.getJWTClaimsSet().getJWTID();
        // Kiểm tra nếu token đã tồn tại trong redis --> Đã logout --> ko verify token này
        if(RedisConnection.isInRedis(tokenId)) return false;
        return signedJWT.verify(new MACVerifier(secretKey));
    }
}
