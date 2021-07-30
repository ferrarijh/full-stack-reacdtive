package com.jonathan.app.service;

import com.jonathan.app.domain.Post;
import org.springframework.util.MultiValueMap;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

public interface PixabayPostService {
    public Flux<Post> getAllPosts();
    public Flux<Post> getAllPosts(int page, int size);
    public Mono<Post> getPostById(String id);
    public Flux<Post> getPostsBy(String query, String page, String size);
    public Mono<String> saveImage(String url) throws Exception;
    public Flux<Post> fetchPosts(MultiValueMap<String, String> map) throws Exception;
}