package com.example.shop.config.Security;

import java.text.ParseException;
import java.util.Objects;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import com.example.shop.service.JwtService;
import com.nimbusds.jose.JOSEException;

@Component
public class JwtDecoderConfig implements JwtDecoder {

    @Value("${app.jwt.secretKey}")
    private String key;

    @Autowired
    private JwtService jwtService;

    private NimbusJwtDecoder nimbusJwtDecoder = null;

    @Override public Jwt decode(String token) throws JwtException {
        // Xác thực token có hợp lệ hay không
        try {
            if (!jwtService.verifyToken(token)) {
                throw new RuntimeException("Token không hợp lệ!");
            }
            if(Objects.isNull(nimbusJwtDecoder)) {
                SecretKey secretKey = new SecretKeySpec(key.getBytes(), "HS512");
                nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKey)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
            }
        } catch (ParseException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (JOSEException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        // Giải mã token
        return nimbusJwtDecoder.decode(token);
    }

}
