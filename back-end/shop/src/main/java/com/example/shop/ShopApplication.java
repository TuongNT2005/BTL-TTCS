package com.example.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.example.shop.repository.CartItemRepository;

@SpringBootApplication
@EnableScheduling
public class ShopApplication {

	public static void main(String[] args) {
		ApplicationContext context = SpringApplication.run(ShopApplication.class, args);
		CartItemRepository cartItemRepository = context.getBean(CartItemRepository.class);

	}

}
