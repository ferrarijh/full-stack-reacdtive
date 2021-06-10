package com.jonathan.app;

import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
import com.jonathan.app.service.PixabayPostService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Required;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

@SpringBootApplication
public class ReactiveApp{

    private final Logger logger = LoggerFactory.getLogger(ReactiveApp.class);

    public static void main(String[] args){
        SpringApplication.run(ReactiveApp.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(PixabayPostService svc, PixabayRepository repo) {
        return args -> {
            repo.findByQuery("cat").subscribe(
                    post -> logger.info(post.getQuery() + " " + post.getUser()+" "+post.getId())
            );
        };
    }
}
