# Full Stack Reactive Project
Full stack reactive project with apps implementing React, Rxjs, Spring WebFlux, MongoDB. Pixabay API key is required to fetch initial data from the API and push it to MongoDB. The project consists of React application and Spring application. Additionally, MongoDB is required to run full simulation.

This project supports docker compose. Build `webflux-server` with maven and then run `docker compose up -d` to instantly run all necessary services.

## Demo

<div>
	<img src="https://github.com/ferrarijh/full-stack-reactive/blob/master/demo/demo-1.gif">
</div>

In the left pane react-rxjs app requests mongodb through spring-webflux server asynchronously, while in the right the request is handled synchronously.

## How to simulate

1. Sign in at [Pixabay API](https://pixabay.com/service/about/api/) and get API key. 

2. Install mongodb, create collection and and set `application.yaml` (or `application.properties`) of `webflux-server`.

3. Run `webflux-server` app and `rxjs-app`. 

*Note: Images will NOT be loaded on the browser after several hours, since the valid image urls that Pixabay API provide changes periodically. So when you don't see the images being loaded and you want them back, you have to empty your MongoDB collection first and then rerun `webflux-server` application to refresh the image urls in the DB.*

4. Fill in the respective inputs in the browser(`rxjs-app`) and update your DB.
 - "Base URL" field: base url for your spring application.
 - "Key" field: your Pixabay API key.
 - "Query Keyword(s)" field: your query keyword(s). Separate each keywords with comma(,).
 - "Page" field: target page to query to the API. (Results are paginated in Pixabay API)

5. Query Mongo db synchronously or asynchronously with single keyword. DB will collect all the documents that include your keyword in the value array of "tag" property.

## Additional features

- Click individual image to save it on your disk. Configure file path in `application.yaml`. This feature was added to test how downloading file works with Spring WebFlux.

The `Keyword(from api)` field shown on the browser is kept for testing.

## Issues

- To fix error `'react-scripts' is not recognized as an internal or external command, operable program or batch file` in `rxjs-app`,
update npm packages with `npm update` command on terminal.

- To fix error `PropertyReferenceException: No property findAll found for type Post` while implementing pagination in `webflux-server`,
add annotation on top of repository method like below.

```java
@Repository
public interface PixabayRepository extends ReactiveMongoRepository<Post, String> {
    
    //...
    
    @Query("{ id: { $exists: true }}")
    Flux<Post> findPage(Pageable pageable);
}
```
