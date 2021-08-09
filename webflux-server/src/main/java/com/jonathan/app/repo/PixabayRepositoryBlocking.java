package com.jonathan.app.repo;

import com.jonathan.app.domain.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PixabayRepositoryBlocking extends MongoRepository<Post, String> {

    @Query("{ tags: { $regex: ?0}}")
    public List<Post> findByTag(String tag);
}
