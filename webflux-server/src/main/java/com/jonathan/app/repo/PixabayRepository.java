package com.jonathan.app.repo;

import com.jonathan.app.domain.Post;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface PixabayRepository extends ReactiveMongoRepository<Post, String> {
    @Query("{ tags: {$regex : ?0}}")
    Flux<Post> findByTag(String tag);

    @Query("{ id: { $exists: true }}")
    Flux<Post> findPage(Pageable pageable);
}