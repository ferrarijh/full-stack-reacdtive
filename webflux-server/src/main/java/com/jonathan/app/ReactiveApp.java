package com.jonathan.app;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.jonathan.app.config.DirConfigProperties;
import com.jonathan.app.domain.Post;
import com.jonathan.app.reactiveclient.ReactiveClient;
import com.jonathan.app.repo.PixabayRepository;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@EnableConfigurationProperties(DirConfigProperties.class)
@SpringBootApplication
@RequiredArgsConstructor
public class ReactiveApp{

    private final Logger logger = LoggerFactory.getLogger(ReactiveApp.class);
    private final String key = Key.KEY;
    private final Gson gson = new Gson();

    private final PixabayRepository repo;
    @Qualifier("imageDownloader") private final WebClient imageDownloader;
    @Qualifier("jsonDownloader") private final WebClient jsonDownloader;

    public static void main(String[] args){
        SpringApplication.run(ReactiveApp.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(PixabayPostService svc) {

        //Check availability of data.
        //If mongoDb is empty then fetch data from $baseUrl with each keyword from the list below and save it to db.
        Mono<Long> dataSizeMono = repo.count().filter(sz -> sz == 0);

        List<String> keywords = Arrays.asList("apple", "pie", "tiger", "potato", "banana", "grape", "monkey", "rose", "cherry", "cake");

        AtomicInteger cnt = new AtomicInteger();

        return args -> {
            dataSizeMono.subscribe(
                    (num)->{
                        repo.count().subscribe(n->logger.info("Number of data: "+n));
                        keywords.forEach(keyword->{
                            savePixabayElement(keyword, cnt);
                        });
                    }
            );
        };
    }

    private void savePixabayElement(String keyword, AtomicInteger cnt){
        jsonDownloader.get()
                .uri("/?key="+key+"&per_page=200&q="+keyword)
                .retrieve()
                .bodyToMono(String.class)
                .map(jsonStr -> JsonParser.parseString(jsonStr).getAsJsonObject()
                        .getAsJsonArray("hits")
                ).subscribe(
                jsonArr -> {
                    jsonArr.forEach(jsonElement -> {
                        JsonObject newObj = jsonElement.getAsJsonObject();
                        newObj.addProperty("query", keyword);
                        repo.save(gson.fromJson(newObj, Post.class)).subscribe();
                        cnt.incrementAndGet();
                    });
                    logger.info("cnt: "+cnt);
                }
        );
    }
}
