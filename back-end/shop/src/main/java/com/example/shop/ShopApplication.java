package com.example.shop;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
		
		Path currentPath = Paths.get(System.getProperty("user.dir"));
		System.out.println(currentPath.toString());

		SpringApplication.run(ShopApplication.class, args);
	}

}
