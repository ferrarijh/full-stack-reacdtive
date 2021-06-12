package com.jonathan.app.controller;

import com.jonathan.app.domain.Post;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@RestController
@RequestMapping("posts/")
public class PostController {

    private final PixabayPostService service;

    @CrossOrigin
    @GetMapping(path="/all", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Post> getAllPosts(){
        return service.getAllPosts();
    }

    @CrossOrigin
    @GetMapping(produces= MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Post> getPostsBy(@RequestParam(value="id", required=false)String id,
                                   @RequestParam(value="query", required=false)String query){
        return service.getPostsBy(id, query);
    }
}
