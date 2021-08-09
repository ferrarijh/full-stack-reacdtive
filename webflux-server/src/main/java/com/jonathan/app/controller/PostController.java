package com.jonathan.app.controller;

import com.jonathan.app.domain.Post;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("posts")
public class PostController {

    private final Logger logger = LoggerFactory.getLogger(PostController.class);
    private final PixabayPostService service;

    @CrossOrigin
    @GetMapping(path="/all", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Post> getAllPosts(){
        return service.getAllPosts();
    }

    @CrossOrigin
    @GetMapping(produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Post> getPostsByTags(@RequestParam MultiValueMap<String, String> keywordsMap){
        return service.getPostsByTag(keywordsMap);
    }

    @CrossOrigin
    @GetMapping(path="/sync", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<Post>> getPostsBlockingByTag(MultiValueMap<String, String> keywordsMap){
        return service.getPostsBlockingByTag(keywordsMap);
    }

    @CrossOrigin
    @GetMapping(path="/saveImage")
    public Mono<String> saveImage(@RequestParam(value="url") String url) throws Exception {
        return service.saveImage(url);
    }

    @CrossOrigin
    @GetMapping(path="/updatePosts", produces = MediaType.APPLICATION_JSON_VALUE)
    public Flux<Post> updatePosts(@RequestParam MultiValueMap<String, String> paramsMap) throws Exception {
        return service.updatePosts(paramsMap);
    }

    @CrossOrigin
    @GetMapping(path="/count", produces=MediaType.TEXT_HTML_VALUE)
    public Mono<String> countPosts(){
        return service.getAllPostsCount();
    }

    @CrossOrigin
    @GetMapping(path="/updatePosts/sync", produces = MediaType.APPLICATION_JSON_VALUE)
    public Mono<List<Post>> updatePostsBlocking(@RequestParam MultiValueMap<String, String> paramsMap) throws Exception {
//        logger.info("updatePostsBlocking...");
        return service.updatePostsBlocking(paramsMap);
    }

    @CrossOrigin
    @DeleteMapping(path="/delete/all")
    public Mono<Void> deleteAllPosts(){
        return service.deleteAllPosts();
    }
}