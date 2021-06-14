# Full Stack Reactive Application
Full stack reactive app with React, Rxjs, Spring WebFlux, MongoDB. Pixabay API key is required to fetch initial data from the API and push it to MongoDB.

## Demo

<div>
	<img src="https://github.com/ferrarijh/full-stack-reactive/blob/master/demo/demo.gif">
</div>

In the left pane react-rxjs app requests mongodb through spring-webflux server  asynchronously, while in the right the request is handled synchronously.

## How to simulate

1. [Pixabay](https://pixabay.com/service/about/api/)

1. Install mongodb, create collection and and set `application.yaml` (or `application.properties`) of `webflux-server`.

2. Run `webflux-server` app and `rxjs-app`. When mongodb collection is empty `webflux-server` automatically fetches a set of initial data with query keywords from pixabay API and push it to mongodb.

inital query keywords:
`"apple", "pie", "tiger", "potato", "banana", "grape", "monkey", "rose", "cherry", "cake"`

##