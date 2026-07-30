package com.example.shop;

import java.util.Iterator;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.dto_interface.UserWithCartItems;
import com.example.shop.entity.User;

import com.example.shop.repository.UserRepository;

@Component
@SpringBootTest
class UserRepoTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSearchUser() {
        String keyword = "us";
        Page<User> users = userRepository.searchUser(PageRequest.of(0, 10), keyword);
        Iterator<User> iter = users.iterator();
        while(iter.hasNext()) {
            System.out.println("======================================");
            System.out.println(iter.next());
        }
    }

    @Test
    @Transactional
    void testFindUserWithCartItemsById() {
        Integer id = 2;
        UserWithCartItems user = userRepository.findABCById(id);

        System.out.println("======================");
        System.out.println(user);
        user.cartItems();
        
    }
}
