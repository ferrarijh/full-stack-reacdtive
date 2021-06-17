package com.jonathan.app.service;
import com.jonathan.app.config.DirConfigProperties;
import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URI;
import java.time.Duration;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class PixabayPostServiceImpl implements PixabayPostService{

    private final PixabayRepository repository;
    private final WebClient client;
    private final DirConfigProperties properties;

    @Override
    public Flux<Post> getAllPosts() {
        return repository.findAll();
    }

    @Override
    public Mono<Post> getPostById(String id) {
        return repository.findById(id);
    }

    @Override
    public Flux<Post> getPostsBy(String id, String query) {

        Flux<Long> interval = Flux.interval(Duration.ofMillis(20));
        Flux<Post> posts;

        if(id == "" || id == null)
            posts = repository.findByQuery(query);
        else
            posts = Flux.from(repository.findById(id));

        return Flux.zip(posts, interval)
                .map(Tuple2::getT1);
//        return posts;
    }

    @Override
    public Mono<String> saveImage(String url) throws Exception {
        try {

            File imgFile = new File(properties.getImgSaveDir(), System.currentTimeMillis()+".jpeg");
            FileOutputStream fos = new FileOutputStream(imgFile, false);

            imgFile.createNewFile();

            client.method(HttpMethod.GET)
                    .uri(url)
                    .accept(MediaType.IMAGE_JPEG)
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .subscribe(
                            bytes -> {
                                try{ fos.write(bytes); }
                                catch (Exception e) {e.printStackTrace();}
                            },
                            Throwable::printStackTrace,
                            () -> {
                                try { fos.close(); }
                                catch (IOException e) { e.printStackTrace(); }
                            }
                    );

            return Mono.just("saving: "+url);
        }catch(Exception e){
            e.printStackTrace();
            return Mono.just("in catch block..");
        }
    }
}