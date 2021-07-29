package com.jonathan.app.reactiveclient;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class ReactiveClient {

    @Primary
    @Bean(name="jsonDownloader")
    public WebClient jsonDownloader(){
        String baseUrl = "https://pixabay.com/api";
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Bean(name="imageDownloader")
    public WebClient imageDownloader(){
        return WebClient.create().mutate().codecs(
                configurer -> configurer.defaultCodecs().maxInMemorySize(10*1024*1024)
        ).build();
    }

}
