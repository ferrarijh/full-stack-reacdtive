import {useState} from 'react'
import {ajax} from 'rxjs/ajax'
import MongoInput from './components/MongoInput'
import ApiInput from './components/ApiInput'
import Posts from './components/Posts'
import Spinner from './components/Spinner'

function App() {

  const LoadingStatus = Object.freeze({
    LOADING: "LOADING",
    DONE: "DONE"
  })

  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.DONE)
  const [posts, setPosts] = useState([])
  const [springBaseUrl, setSpringBaseUrl] = useState('http://localhost:8080/posts')

  const handleSubmitMongoAsync = (query) => (e) =>{
    e.preventDefault()
    setPosts([])

    var queryUrl = springBaseUrl;
    if(query !== '')
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

    var queryUrl = springBaseUrl
    if(query !== '')
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
        console.log(JSON.parse(JSON.stringify(ajaxRes.response)))
        setPosts((prevPosts)=>{
          setLoadingStatus(LoadingStatus.DONE)
          return [...prevPosts, ...JSON.parse(JSON.stringify(ajaxRes.response))]
        });
      },
      error: (err)=>{console.log(err)}
    })
  }

  const onImgClick = (imageUrl)=>{
    console.log(imageUrl)
    let path = '/saveImg'
    let params = '?url='+imageUrl
    let queryUrl = springBaseUrl+path+params

    ajax({
      url: queryUrl,
      method: 'GET'
    }).subscribe({
      next: (ajaxRes)=>console.log(ajaxRes.response)
    })
  }

  const handleUpdate = (key, q, p, sz)=>(e)=>{
    e.preventDefault()
    if(springBaseUrl === '' || key === '' || q === '')
      return
    
    setPosts([])
    setLoadingStatus(LoadingStatus.LOADING)
    let keywords = q.split(',')

    var mUrl = springBaseUrl + '/updatePosts?'
    keywords.forEach( k => mUrl += 'keywords=' + k + '&')
    mUrl += 'page='+p+"&per_page="+sz+"&key="+key

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
      setLoadingStatus(LoadingStatus.DONE)
      console.log(ev.data)
      setPosts((prevPosts)=>[...prevPosts, JSON.parse(ev.data)])
    }
    evtSrc.onerror = (err)=>{
      evtSrc.close()
    }
  }

  return (
    <div className="App">
      <h1>Query Result Count: {posts.length}</h1>
      <hr/>
      <div className="containers">
        <div className="mongoInputContainer">
          <label className='inputGuide'><i>Query mongo db.</i></label>
          <MongoInput handleSubmit={handleSubmitMongoAsync} guide='Keyword(from mongo): ' btnValue="Go Async"/>
          <MongoInput handleSubmit={handleSubmitMongoSync} guide='Keyword(from mongo): ' btnValue="Go Sync"/>
        </div> 
        <ApiInput handleSubmit={handleUpdate} guide='Query keyword(s): ' springBaseUrl={springBaseUrl} setSpringBaseUrl={setSpringBaseUrl} btnValue="Update"/>
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