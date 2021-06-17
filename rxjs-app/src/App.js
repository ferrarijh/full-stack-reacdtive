import {useEffect, useState} from 'react'
import {EMPTY, from, zip, interval} from 'rxjs'
import {map, mergeMap, mergeWith} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
import Header from './components/Header'
import Input from './components/Input'
import Posts from './components/Posts'
import Spinner from './components/Spinner'
import key from './Key'
import {keywords} from './SampleData'

function App() {
  const LoadingStatus = Object.freeze({
    LOADING: "LOADING",
    DONE: "DONE"
  })
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.DONE)
  const [posts, setPosts] = useState([])

  const handleSubmit = (query) => e => {
    e.preventDefault()
    setPosts([])

    console.log("handleSubmit()..")

    let per_page = query
    const proxyUrl = 'http://localhost:3001/'
    const queryUrl = 'https://pixabay.com/api/?key='+key+'&per_page='+per_page+'&q='

    //emits json element
    const observables$ = keywords.map((k)=>{
      return from(fetch(proxyUrl, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'targetUrl': queryUrl + k
            })
          }).then(res=>res.json())
        )
        // return ajax({
        //   url: proxyUrl,
        //   method: 'POST',
        //   body: {
        //     'targetUrl': queryUrl + k
        //   }
        // })
        .pipe(
          // map(jsonRes => jsonRes['response']['hits']),
          mergeMap(jsonRes => {
            return from(jsonRes['hits'])
          })
        )
    })

    const merged$ = EMPTY.pipe(
        mergeWith(...observables$)
    )

    merged$.subscribe({
      next: (p)=>{
        setPosts((prevPosts)=>{
          console.log(p)
          return [...prevPosts, p]
        })
      },
      // next: (newPosts)=>{setPosts((prevPosts)=>[...prevPosts, ...newPosts])},
      error: (err)=>{ console.log(err) }
    })
  }

  const handleSubmitMongoAsync = (query) => (e) =>{
    e.preventDefault()
    setPosts([])

    const baseUrl = 'http://localhost:8080/posts';
    var queryUrl = baseUrl;
    if(query != '')
      queryUrl += '/?query='+query
    else
      queryUrl += '/all'
      
    // from(fetch(queryUrl, {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json'
    //     }
    //   }).then(
    //     res=>res.json()
    //   )
    // ).subscribe({
    //   next: (p)=>{
    //     console.log("post:",p)
    //     setPosts((prevPosts)=>{return [...prevPosts, p]});
    //   },
    //   error: (err)=>{console.log(err)}
    // })

    // ajax({
    //     url: queryUrl,
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'text/event-stream'
    //     }
    //   })
    //   .subscribe({
    //         next: (p)=>{
    //           console.log(p)
    //           setPosts((prevPosts)=>{return [...prevPosts, p]});
    //         },
    //         error: (err)=>{console.log(err)}
    //   })

    const evtSrc = new EventSource(queryUrl)
    evtSrc.onmessage = (ev)=>{
      console.log(ev.data)
      setPosts((prevPosts)=>[...prevPosts, JSON.parse(ev.data)])
    }
    evtSrc.onerror = (err)=>{
      evtSrc.close()
    }
  }

  const onTrashBtnClick = (e) => {
    e.preventDefault();
    setPosts([])
  }

  const handleSubmitMongoSync = (query) => (e) => {
    e.preventDefault();
    setPosts([]);
    setLoadingStatus(LoadingStatus.LOADING)

    const baseUrl = 'http://localhost:8080/posts';
    var queryUrl = baseUrl;
    if(query != '')
      queryUrl += '/sync/?query='+query
    else
      queryUrl += '/all'

    ajax({
      url: queryUrl,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (ajaxRes)=>{
        setPosts((prevPosts)=>{
          setLoadingStatus(LoadingStatus.DONE)
          return [...prevPosts, ...ajaxRes.response]
        });
      },
      error: (err)=>{console.log(err)}
    })
  }

  const onImgClick = (imageUrl)=>{
    console.log(imageUrl)
    let baseUrl = 'http://localhost:8080'
    let path = '/posts/saveImg'
    let params = '?url='+imageUrl
    let queryUrl = baseUrl+path+params

    ajax({
      url: queryUrl,
      method: 'GET'
    }).subscribe({
      next: (ajaxRes)=>console.log(ajaxRes.response)
    })
  }

  return (
    <div className="App">
      <Header postLen={posts.length}/>
      <hr/>
      <div className="inputContainer">   
        <Input handleSubmit={handleSubmit} guide='Keyword(from api): ' btnValue="Go"/>
        <Input handleSubmit={handleSubmitMongoAsync} guide='Keyword(from mongo): ' btnValue="Go Async"/>
        <Input handleSubmit={handleSubmitMongoSync} guide='Keyword(from mongo): ' btnValue="Go Sync"/>
      </div> 
      <form id="trashForm" onSubmit={onTrashBtnClick}>
        <input id="trashBtn" type="submit" value="🗑️" />
      </form>
      <hr/>
      {loadingStatus === LoadingStatus.LOADING && <Spinner/>}
      <Posts posts={posts} onImgClick={onImgClick}/>
    </div>
  );
}

export default App;