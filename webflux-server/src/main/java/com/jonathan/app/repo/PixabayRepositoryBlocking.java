package com.jonathan.app.repo;

import com.jonathan.app.domain.Post;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PixabayRepositoryBlocking extends CrudRepository<Post, String> {

}
