import {useEffect, useState} from 'react'
import {EMPTY, from, zip, interval} from 'rxjs'
import {map, mergeMap, mergeWith} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
import Header from './components/Header'
import Input from './components/Input'
import Posts from './components/Posts'
import key from './Key'
import {keywords} from './SampleData'


function App() {
  const [posts, setPosts] = useState([])

  const handleSubmit = (e, query)=>{
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

  return (
    <div className="App">
      <Header postLen={posts.length}/>
      <Input handleSubmit={handleSubmit}/>
      {/* <Body buf={results} handleSubmit={handleSubmit}/> */}
      <Posts posts={posts}/>
    </div>
  );
}

export default App;