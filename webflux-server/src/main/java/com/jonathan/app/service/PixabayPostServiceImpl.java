package com.jonathan.app.service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import com.google.gson.reflect.TypeToken;
import com.jonathan.app.Key;
import com.jonathan.app.config.ConfigProperties;
import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
import com.jonathan.app.repo.PixabayRepositoryBlocking;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;

import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Type;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PixabayPostServiceImpl implements PixabayPostService{
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final PixabayRepositoryBlocking blockingRepository;
    private final PixabayRepository repository;
    @Qualifier("imageDownloader") private final WebClient imageDownloader;
    @Qualifier("jsonDownloader") private final WebClient jsonDownloader;
    private final ConfigProperties properties;
    private final Gson gson;

    @Override
    public Flux<Post> getAllPosts() {
        Flux<Long> interval = Flux.interval(Duration.ofMillis(30));
        return Flux.zip(repository.findAll(), interval).map(Tuple2::getT1);
    }

    @Override
    public Flux<Post> getAllPosts(int page, int size) {
        return repository.findPage(PageRequest.of(page, size));
    }

    @Override
    public Mono<Post> getPostById(String id) {
        return repository.findById(id);
    }

    @Override
    public Flux<Post> getPostsByTag(MultiValueMap<String, String> keywordsMap) {
        return Flux.fromIterable(keywordsMap.get("keywords"))
                .flatMap(repository::findByTag);
    }

    @Override
    public Mono<String> saveImage(String url) throws Exception {
        try {

            File imgFile = new File(properties.getImgSaveDir(), System.currentTimeMillis()+".jpeg");
            FileOutputStream fos = new FileOutputStream(imgFile, false);

            imgFile.createNewFile();

            return imageDownloader.method(HttpMethod.GET)
                    .uri(url)
                    .accept(MediaType.IMAGE_JPEG)
                    .retrieve()
                    .bodyToMono(byte[].class)
                    .doOnNext(
                            bytes -> {
                                try{
                                    fos.write(bytes);
                                    fos.close();
                                } catch (Exception e) {e.printStackTrace();}
                            }
                    ).map(bytes -> "Saved "+bytes.length+" bytes.");
        }catch(Exception e){
            e.printStackTrace();
            return Mono.just("in catch block..");
        }
    }

    @Override
    public Flux<Post> updatePosts(MultiValueMap<String, String> paramsMap){
//        logger.info(String.valueOf(paramsMap.get("keywords").size()));
        String rearParams = paramsStringExceptKeyword(paramsMap);

        return Flux.fromIterable(paramsMap.get("keywords"))     //Flux<String>
                .flatMap(k -> {
                    String path = "/?q=" + k + "&" + rearParams;
                    return jsonDownloader.get()
                            .uri(properties.getBaseUrl() + path)
                            .retrieve()
                            .bodyToMono(String.class)
                            .flatMapMany(str -> {
                                List<Post> list = postsListFromStr(str);
                                return repository.saveAll(list);
                            });
                });
    }

    private List<Post> postsListFromStr(String str){
        Type type = new TypeToken<List<Post>>(){}.getType();

        JsonArray jsonArray = JsonParser.parseString(str)
                .getAsJsonObject()
                .get("hits")
                .getAsJsonArray();

        Iterator<JsonElement> iter = jsonArray.iterator();
        while(iter.hasNext()){
            JsonObject obj = iter.next().getAsJsonObject();
            String[] tags = obj.get("tags").getAsString().split(", ");
            obj.remove("tags");
            JsonArray tagsJsonArr = new JsonArray();
            for(String tag: tags)
                tagsJsonArr.add(tag);
            obj.add("tags", tagsJsonArr);
        }

        return gson.fromJson(jsonArray, type);
    }

    @Override
    public Mono<String> getAllPostsCount(){
        return repository.count().map(Object::toString);
    };

    @Override
    public Mono<Void> deleteAllPosts() {
        return repository.deleteAll();
    }

    @Override
    public Mono<List<Post>> updatePostsBlocking(MultiValueMap<String, String> paramsMap){
        String rearParams = paramsStringExceptKeyword(paramsMap);

        return Flux.fromIterable(paramsMap.get("keywords"))
                .flatMap(k -> {
                    String path = "/?q=" + k + "&" + rearParams;
                    return jsonDownloader.get()
                            .uri(properties.getBaseUrl() + path)
                            .retrieve()
                            .bodyToMono(String.class)
                            .flatMapMany(str -> {
                                List<Post> list = postsListFromStr(str);
                                blockingRepository.saveAll(list);
                                return Flux.fromIterable(list);
                            });
                }).collectList();

    }

    @Override
    public Mono<List<Post>> getPostsBlockingByTag(MultiValueMap<String, String> keywordsMap) {
        List<Post> posts = new ArrayList<>();
        for(String k: keywordsMap.get("keywords"))
            posts.addAll(blockingRepository.findByTag(k));

        return Mono.just(posts);
    }

    public String paramsStringExceptKeyword(MultiValueMap<String, String> params){
        StringBuilder sb = new StringBuilder();
        params.forEach((k, list)->{
            if(!k.equals("keywords"))
                sb.append(k).append("=").append(list.get(0)).append("&");
        });
        return sb.substring(0, sb.length()-1);
    }
}