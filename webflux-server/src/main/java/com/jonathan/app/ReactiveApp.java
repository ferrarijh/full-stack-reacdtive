package com.jonathan.app;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
import com.jonathan.app.service.PixabayPostService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootApplication
public class ReactiveApp{

    private final Logger logger = LoggerFactory.getLogger(ReactiveApp.class);

    public static void main(String[] args){
        SpringApplication.run(ReactiveApp.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(PixabayPostService svc, PixabayRepository repo) {

        //Check availability of data.
        //If mongoDb is empty then fetch data from $baseUrl with each keyword from the list below and save it to db.
        Mono<Long> dataSizeMono = repo.count()
                .filter(sz -> sz == 0);

        List<String> keywords = Arrays.asList("apple", "pie", "tiger", "potato", "banana", "grape", "monkey", "rose", "cherry", "cake");

        String baseUrl = "https://pixabay.com/api";
        WebClient wClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        String key = Key.KEY;
        Gson gson = new Gson();

        AtomicInteger cnt = new AtomicInteger();

        return args -> {
            dataSizeMono.subscribe(
                    (num)->{
                        repo.count().subscribe(n->logger.info("count: "+n));
                        keywords.forEach(keyword->{
                            wClient.get()
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
                        });
                    }
            );
        };
    }
}
