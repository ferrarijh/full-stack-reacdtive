# Full Stack Reactive Application
Full stack reactive app with React, Rxjs, Spring WebFlux, MongoDB. Pixabay API key is required to fetch initial data from the API and push it to MongoDB.

## Demo

<div>
	<img src="https://github.com/ferrarijh/full-stack-reactive/blob/master/demo/demo.gif">
</div>

In the left pane react-rxjs app requests mongodb through spring-webflux server  asynchronously, while in the right the request is handled synchronously.

## How to simulate

1. Sign in at [Pixabay API](https://pixabay.com/service/about/api/) and get API key. 

2. In `webflux-server` project, create `Key` class and put your API key in the `KEY` field.
```java
package com.jonathan.app;

public class Key {
    public static String KEY = ${your-key-here};
}
```

3. In `rxjs-app`, create `Key` class with `key` value and export it as default.
```javascript
//Key.js
const key = "19443478-73723d2b3ab0b10dc457093b2"
export default key
```

4. Install mongodb, create collection and and set `application.yaml` (or `application.properties`) of `webflux-server`.

5. Run `webflux-server` app and `rxjs-app`. When mongodb collection is empty `webflux-server` automatically fetches a set of initial data with query keywords from Pixabay API and push it to mongodb. `webflux-server` will request for json dataset to the API with the respective query keywords below and then add `query` field to each json result to finally save it to mongodb.
   - inital query keywords:
`"apple", "pie", "tiger", "potato", "banana", "grape", "monkey", "rose", "cherry", "cake"`

6. In the browser(`rxjs-app`) use two `Keyword(from mongo)` input fields to test asynchronous/synchronous request result. Use the above query keywords for each input field.

## Additional features

- Click individual image to save it on your disk. Configure file path in `application.yaml`. This feature was added to test how downloading file works with Spring WebFlux.

The `Keyword(from api)` field shown on the browser is kept for testing.

## Issues

To fix error `'react-scripts' is not recognized as an internal or external command, operable program or batch file` in `rxjs-app`,
update npm packages with `npm update` command on terminal.
