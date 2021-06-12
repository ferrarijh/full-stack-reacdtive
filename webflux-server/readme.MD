### Querying to mongoDB

Spring Mongo automatically parses function name to perform respective query. 

Example:
```java
@Repository
public interface PixabayRepository extends ReactiveMongoRepository<Post, String> {
    //same with db.postcollection.find({"query":"{q}"})
    Flux<Post> findByQuery(String q);
}
```