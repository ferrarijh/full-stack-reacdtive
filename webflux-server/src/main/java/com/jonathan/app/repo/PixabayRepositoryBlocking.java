package com.jonathan.app.repo;

import com.jonathan.app.domain.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PixabayRepositoryBlocking extends MongoRepository<Post, String> {

}
