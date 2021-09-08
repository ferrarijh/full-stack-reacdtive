import { useState } from 'react'
import { ajax } from 'rxjs/ajax'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import Header from './components/Header'
import MongoInput from './components/MongoInput'
import ApiInput from './components/ApiInput'
import Posts from './components/Posts'
import LoadingStatus from './LoadingStatus'

function App() {

  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.DONE)
  const [posts, setPosts] = useState([])
  const [springBaseUrl, setSpringBaseUrl] = useState('http://localhost:8080/posts')

  const sseObservable = (url)=>{
    return new Observable(subscriber => {
      const es = new EventSource(url)
      es.onmessage = ev => subscriber.next(ev.data)
      es.onerror = ev => subscriber.error()

      return () => es.close() 
    }).pipe(
      map(data => JSON.parse('['+data+']'))
    )
  }

  const ajaxObservable = (url)=>{
    return ajax({
      url: url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map(ajaxRes => JSON.parse(JSON.stringify(ajaxRes.response)))
    )
  }

  const handleSubmitMongoAsync = (queries) => (e) => {
    e.preventDefault()
    setPosts([])
    setLoadingStatus(LoadingStatus.LOADING)

    var queryUrl = springBaseUrl;
    if (queries !== ''){
      queryUrl += '?'
      let keywords = queries.split(',')
      keywords.forEach(k => queryUrl += "keywords="+k+"&")
      queryUrl = queryUrl.substr(0, queryUrl.length-1)
    }else
      queryUrl += '/all'

    const observable$ = sseObservable(queryUrl)
    // const observable$ = ajaxObservable(queryUrl)

    observable$.subscribe({
      next: jsonArr => { 
        setLoadingStatus(LoadingStatus.DONE)
        setPosts((prevPosts) => [...prevPosts, ...jsonArr]) 
      },
      error: err => console.log(err)
    })
  }

  const onTrashBtnClick = (e) => {
    e.preventDefault();
    setPosts([])
  }

  const handleSubmitMongoSync = (queries) => (e) => {
    e.preventDefault();
    setPosts([]);
    setLoadingStatus(LoadingStatus.LOADING)

    var queryUrl = springBaseUrl
    if (queries !== ''){
      queryUrl += '/sync?'
      let keywords = queries.split(',')
      keywords.forEach(k => queryUrl += "keywords="+k+"&")
      queryUrl = queryUrl.substr(0, queryUrl.length-1)
    }
    else
      queryUrl += '/all/sync'

    const observable$ = ajaxObservable(queryUrl)
    observable$.subscribe({
      next: (jsonArr) => {
        setLoadingStatus(LoadingStatus.DONE)
        setPosts((prevPosts) =>  [...prevPosts, ...jsonArr]);
      },
      error: err => console.log(err)
    })
  }

  const onImgClick = (imageUrl) => {
    console.log(imageUrl)
    let path = '/saveImg'
    let params = '?url=' + imageUrl
    let queryUrl = springBaseUrl + path + params

    ajax({
      url: queryUrl,
      method: 'GET'
    }).subscribe({
      next: (ajaxRes) => console.log(ajaxRes.response)
    })
  }

  const handleUpdate = (options) => (e) => {
    e.preventDefault()
    if (springBaseUrl === '' || options.key === '' || options.queries === '')
      return

    setPosts([])
    setLoadingStatus(LoadingStatus.LOADING)
    let keywords = options.queries.split(',')

    var queryUrl = springBaseUrl + '/updatePosts' + (options.syncOrAsync==='sync' ? '/sync' : '') + '?'
    keywords.forEach(k => queryUrl += 'keywords=' + k + '&')
    queryUrl += 'page=' + options.page + "&per_page=" + options.size + "&key=" + options.key

    let observable$ = options.syncOrAsync === 'async' ? sseObservable(queryUrl) : ajaxObservable(queryUrl)
    // let observable$ = ajaxObservable(queryUrl)

    observable$.subscribe({
      next: data => {
        setLoadingStatus(LoadingStatus.DONE)
        setPosts((prevPosts) => [...prevPosts, ...data])
      },
      error: err => console.log(err)
    })
  }

  return (
    <div className="App">
      <Header postsLength={posts.length} baseUrl={springBaseUrl} />
      <hr />
      <div className="containers">

        <div className="mongoInputContainer">
          <h2>Query Mongo DB</h2>
          <label className='inputGuide'><i>Query mongo db for locally saved posts.</i></label>
          <MongoInput handleSubmit={handleSubmitMongoAsync} guide='Keyword: ' btnValue="Query Async" />
          <MongoInput handleSubmit={handleSubmitMongoSync} guide='Keyword: ' btnValue="Query Sync" />
        </div>

        <ApiInput handleSubmit={handleUpdate} guide='Query keyword(s): ' springBaseUrl={springBaseUrl} setSpringBaseUrl={setSpringBaseUrl} />
      </div>
      <form id="trashForm" onSubmit={onTrashBtnClick}>
        <input id="trashBtn" type="submit" value="Empty Result 🗑️" />
      </form>
      <hr />
      <Posts posts={posts} loadingStatus={loadingStatus} onImgClick={onImgClick} />
    </div>
  );
}

export default App;