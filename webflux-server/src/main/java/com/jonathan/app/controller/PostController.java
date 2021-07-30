package com.jonathan.app.controller;

import com.jonathan.app.domain.Post;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

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
    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Post> getPostsBy(@RequestParam(value="query", required=false)String query,
                                 @RequestParam(value="page", required=false) String page,
                                 @RequestParam(value="size", required=false) String size
                                 ){
        return service.getPostsBy(query, page, size);
    }

    @CrossOrigin
    @GetMapping(path="/sync", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Post> getPostsBlockingBy(@RequestParam(value="query", required=false)String query){
        return service.getPostsBy(query, null, null);
    }

    @CrossOrigin
    @GetMapping(path="/saveImage")
    public Mono<String> saveImage(@RequestParam(value="url") String url) throws Exception {
        return service.saveImage(url);
    }

    @CrossOrigin
    @GetMapping(path="/updatePosts", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Post> updatePosts(@RequestParam MultiValueMap<String, String> paramsMap) throws Exception {
        return service.fetchPosts(paramsMap);
    }
}