package com.jonathan.app.service;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.google.gson.reflect.TypeToken;
import com.jonathan.app.Key;
import com.jonathan.app.config.ConfigProperties;
import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
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
import reactor.util.function.Tuple2;

import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Type;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PixabayPostServiceImpl implements PixabayPostService{
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private final PixabayRepository repository;
    @Qualifier("imageDownloader") private final WebClient imageDownloader;
    @Qualifier("jsonDownloader") private final WebClient jsonDownloader;
    private final ConfigProperties properties;
    private final String key = Key.KEY;

    @Override
    public Flux<Post> getAllPosts() {
        return repository.findAll();
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
    public Flux<Post> getPostsBy(String tag, String page, String size) {

        Flux<Long> interval = Flux.interval(Duration.ofMillis(20));
        Flux<Post> posts;

        if (page != null){
            int pageInt = Integer.parseInt(page);
            int sizeInt = (size == null) ? 0 : Integer.parseInt(size);
            posts = repository.findPage(PageRequest.of(pageInt, sizeInt));
        }else
            posts = repository.findByTag(tag);

        return Flux.zip(posts, interval)
                .map(Tuple2::getT1);
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
    public Flux<Post> fetchPosts(MultiValueMap<String, String> paramsMap) throws Exception {
//        logger.info(String.valueOf(paramsMap.get("keywords").size()));

        String rearParams = paramsStringExceptKeyword(paramsMap);
        Type type = new TypeToken<List<Post>>(){}.getType();
        Gson gson = new Gson();

        List<Mono<String>> monoList = paramsMap.get("keywords").stream()
                .map(k -> {
                    String path = "/?q=" + k + "&" + rearParams;
                    return jsonDownloader.get()
                            .uri(properties.getBaseUrl() + path)
                            .retrieve()
                            .bodyToMono(String.class);
                }).collect(Collectors.toList());

        return Flux.merge(monoList)
                .flatMap(str -> {
                    JsonArray jsonArray = JsonParser.parseString(str)
                            .getAsJsonObject()
                            .get("hits")
                            .getAsJsonArray();
                    List<Post> list = gson.fromJson(jsonArray, type);
                    return repository.saveAll(list);
                });
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