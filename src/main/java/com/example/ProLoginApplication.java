package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import tools.jackson.databind.ObjectMapper;

@SpringBootApplication
public class ProLoginApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProLoginApplication.class, args);
	}

	@Bean
	public ObjectMapper getObjectMapper(){
		return new ObjectMapper();
	}

}
