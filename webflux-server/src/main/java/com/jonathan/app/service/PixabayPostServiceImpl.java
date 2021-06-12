package com.jonathan.app.service;
import com.jonathan.app.domain.Post;
import com.jonathan.app.repo.PixabayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class PixabayPostServiceImpl implements PixabayPostService{

    private final PixabayRepository repository;

    @Override
    public Flux<Post> getAllPosts() {
        return repository.findAll();
    }

    @Override
    public Mono<Post> getPostById(String id) {
        return repository.findById(id);
    }

    @Override
    public Flux<Post> getPostsBy(String id, String query) {
        if(id.isEmpty())
            return repository.findByQuery(query);
        else
            return Flux.from(repository.findById(id));
    }
}