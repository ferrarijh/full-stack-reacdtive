package com.jonathan.app.controller;

import com.jonathan.app.domain.Post;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("posts/")
public class PostController {

    private final PixabayPostService service;

    @GetMapping(path="/all")
    public Flux<Post> getAllPosts(){
        return service.getAllPosts();
    }

    @GetMapping("/post")
    public Mono<Post> getPostById(@RequestParam("id") String id){
        return service.getPostById(id);
    }
}
