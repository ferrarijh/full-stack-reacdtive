package com.jonathan.app.service;

import com.jonathan.app.domain.Post;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PixabayPostService {
    public Flux<Post> getAllPosts();
    public Mono<Post> getPostById(String id);
    public Flux<Post> getPostsByQuery(String query);
}