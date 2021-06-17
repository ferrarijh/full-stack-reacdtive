package com.jonathan.app.reactiveclient;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ReactiveClient {

    @Bean
    public WebClient webClient(){
        return WebClient.create();
    }
}
