import {useState} from 'react'
import {EMPTY, from, zip, interval} from 'rxjs'
import {mergeMap, mergeWith} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
import Header from './components/Header'
import MongoInput from './components/MongoInput'
import ApiInput from './components/ApiInput'
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
  const [baseUrl, setBaseUrl] = useState('http://localhost:8080/posts')

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

  const handleUpdate = (q, p, sz)=>(e)=>{
    e.preventDefault()
    let keywords = q.split(',')

    var mUrl = baseUrl + '/updatePosts?';
    keywords.forEach( k => mUrl += 'keywords=' + k + '&')
    mUrl += 'page='+p+"&per_page="+sz

    // ajax({
    //   url: mUrl,
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).subscribe({
    //   next: (ajaxRes)=>{
    //     console.log(ajaxRes.response)
    //     setPosts((prevPosts)=>{return [...prevPosts, JSON.parse(ajaxRes.response)]})
    //   }
    // });

    const evtSrc = new EventSource(mUrl)
    evtSrc.onmessage = (ev)=>{
      console.log(ev.data)
      setPosts((prevPosts)=>[...prevPosts, JSON.parse(ev.data)])
    }
    evtSrc.onerror = (err)=>{
      evtSrc.close()
    }
  }

  return (
    <div className="App">
      <Header postLen={posts.length}/>
      <div className="baseUrlContainer">
        <label>Base URL: </label>
        <input type="text" defaultValue="http://localhost:8080/posts" onChange={(e)=>setBaseUrl(e.target.value)}/>
      </div>
      <hr/>
      <div className="containers">
        <div className="mongoInputContainer">
          <text className='inputGuide'><i>Query mongo db.</i></text>
          <MongoInput handleSubmit={handleSubmitMongoAsync} guide='Keyword(from mongo): ' btnValue="Go Async"/>
          <MongoInput handleSubmit={handleSubmitMongoSync} guide='Keyword(from mongo): ' btnValue="Go Sync"/>
        </div> 
        <div className="apiInputContainer">
          <ApiInput handleSubmit={handleUpdate} guide='Query keyword(s): ' btnValue="Update"/>
        </div>
      </div>
      <form id="trashForm" onSubmit={onTrashBtnClick}>
        <input id="trashBtn" type="submit" value="Empty Result 🗑️" />
      </form>
      <hr/>
      {loadingStatus === LoadingStatus.LOADING && <Spinner/>}
      <Posts posts={posts} onImgClick={onImgClick}/>
    </div>
  );
}

export default App;