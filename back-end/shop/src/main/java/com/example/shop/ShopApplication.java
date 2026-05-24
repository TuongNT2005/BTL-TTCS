package com.example.shop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ShopApplication {

	public static void main(String[] args) {
		//FileUtil.getPath("comment_1773375453148.png");
		//FileUtil.deleteFile("avatars_1111111.jpg");
		//System.out.println(Converter.convertStringToCapitalizedForm("tuong Nguyen      TRUNG"));
		
		SpringApplication.run(ShopApplication.class, args);
	}

}
