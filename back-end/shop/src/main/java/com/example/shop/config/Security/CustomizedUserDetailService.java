package com.example.shop.config.Security;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.example.shop.entity.User;
import com.example.shop.enums.UserEnum;
import com.example.shop.repository.UserRepository;

@Service
public class CustomizedUserDetailService implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;


    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(String.format("User with username: %s does not exist",username)));
            
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), convertRolesToAuthorities(List.of(user.getRole())));
    }

    private Collection<GrantedAuthority> convertRolesToAuthorities(List<UserEnum> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority("SCOPE_" + role.toString())).collect(Collectors.toList());
    }
}
