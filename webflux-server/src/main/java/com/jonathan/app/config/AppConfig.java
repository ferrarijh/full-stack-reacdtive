package com.jonathan.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import org.springframework.boot.web.codec.CodecCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.util.MimeType;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Configuration
public class AppConfig {
//    @Bean
//    public CodecCustomizer ndJsonCustomizer(ObjectMapper objectMapper){
//        Jackson2JsonDecoder jsonDecoder = new Jackson2JsonDecoder(objectMapper,
//                new MimeType("application", "json"), new MimeType("application", "x-ndjson"));
//        return codecs -> codecs.defaultCodecs().jackson2JsonDecoder(jsonDecoder);
//    }

//    @Bean
//    public ObjectMapper objectMapper(){
//        return new ObjectMapper();
//    }

    @Bean
    public Gson gson(){
        return new Gson();
    }

//    @Bean
//    public ExecutorService blockingExecutor(){
//        return Executors.newFixedThreadPool(200);
//    }
}
