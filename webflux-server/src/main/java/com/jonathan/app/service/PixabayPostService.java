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
    public Flux<Post> getPostsByTag(MultiValueMap<String, String> keywordsMap);
    public Mono<String> saveImage(String url) throws Exception;
    public Flux<Post> updatePosts(MultiValueMap<String, String> map);
    public Mono<String> getAllPostsCount();
    public Mono<Void> deleteAllPosts();

    public Mono<List<Post>> getPostsBlockingByTag(MultiValueMap<String, String> keywordsMap);
    public Mono<List<Post>> updatePostsBlocking(MultiValueMap<String, String> map);
}