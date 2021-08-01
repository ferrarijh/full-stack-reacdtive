package com.jonathan.app;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.jonathan.app.config.ConfigProperties;
import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@EnableConfigurationProperties(ConfigProperties.class)
@SpringBootApplication
@RequiredArgsConstructor
public class ReactiveApp{

    private final Logger logger = LoggerFactory.getLogger(ReactiveApp.class);

    public static void main(String[] args){
        SpringApplication.run(ReactiveApp.class, args);
    }
}
