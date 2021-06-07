import {useEffect, useState, useRef} from 'react'
import {from, zip, interval} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
import Header from './components/Header'
import Input from './components/Input'
import Posts from './components/Posts'

const testSet = [
  {
      "id":324175,
      "pageURL":"https://pixabay.com/photos/pink-cherry-blossoms-flowers-branch-324175/",
      "type":"photo",
      "tags":"pink, cherry blossoms, flowers",
      "previewURL":"https://cdn.pixabay.com/photo/2014/04/14/20/11/pink-324175_150.jpg",
      "previewWidth":150,
      "previewHeight":99,
      "webformatURL":"https://pixabay.com/get/g1f4f6ce19797a16ec80008088d549f140b9f85aa9bbd389efcedfee4d80e1cee2bf33b5b47ff188e44b4ca9711bcf06e_640.jpg",
      "webformatWidth":640,
      "webformatHeight":426,
      "largeImageURL":"https://pixabay.com/get/gb9893fc590dc4a2d157f6911879455a0b30009cbdec3ee1d66a422e71b6103d4750468b7bad4e36a76c1f98fe6d5b87ea628a9356118fae891410cd327046eb9_1280.jpg",
      "imageWidth":6000,
      "imageHeight":4000,
      "imageSize":2613829,
      "views":2814519,
      "downloads":1347826,
      "favorites":2998,
      "likes":4109,
      "comments":924,
      "user_id":2,
      "user":"Hans",
      "userImageURL":"https://cdn.pixabay.com/user/2019/01/29/15-01-52-802_250x250.jpg"
  },
  {
      "id":729510,
      "pageURL":"https://pixabay.com/photos/marguerite-daisy-flower-white-729510/",
      "type":"photo",
      "tags":"marguerite, daisy, flower",
      "previewURL":"https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510_150.jpg",
      "previewWidth":150,
      "previewHeight":97,
      "webformatURL":"https://pixabay.com/get/g2139aa59cf27c53eca34100b951f768fb79fe0eedab8a08caff9a2264c6c51be1d57533534bc1d58be36c41682584628_640.jpg",
      "webformatWidth":640,
      "webformatHeight":416,
      "largeImageURL":"https://pixabay.com/get/gc280f5f769426d4b562cbf084927220698c26e5cd19a5598e894219479e43d85ff2201a1a112387084e74fb2f3e9e13ea243dc6830627f4a95cabbb7de2163be_1280.jpg",
      "imageWidth":1980,
      "imageHeight":1289,
      "imageSize":307038,
      "views":790463,
      "downloads":307840,
      "favorites":1603,
      "likes":2034,
      "comments":475,
      "user_id":909086,
      "user":"Bessi",
      "userImageURL":"https://cdn.pixabay.com/user/2019/04/11/22-45-05-994_250x250.jpg"
  },
  {
      "id":1770165,
      "pageURL":"https://pixabay.com/illustrations/roses-collage-vintage-antique-1770165/",
      "type":"illustration",
      "tags":"roses, collage, vintage",
      "previewURL":"https://cdn.pixabay.com/photo/2016/10/25/22/22/roses-1770165_150.png",
      "previewWidth":150,
      "previewHeight":120,
      "webformatURL":"https://pixabay.com/get/g98b155761bd1cf01a8a85fe0645ec49b1a1a1c6cba2156eefb38b540f5b9b6fff6ad553442463a3105383af1230177398935a4b51835c7f833e16fa695ac96b5_640.png",
      "webformatWidth":640,
      "webformatHeight":512,
      "largeImageURL":"https://pixabay.com/get/g095130ab0afc4762302ac7ffcf1043f67ff45efbea055d6ac96ce97b0391898a135fdbabf891c12f9156479de07b2acd0641f7d60738f7479493a4283fc739f7_1280.png",
      "imageWidth":3000,
      "imageHeight":2400,
      "imageSize":6369203,
      "views":454915,
      "downloads":164955,
      "favorites":2039,
      "likes":1856,
      "comments":449,
      "user_id":462611,
      "user":"ArtsyBee",
      "userImageURL":"https://cdn.pixabay.com/user/2014/10/01/08-58-08-781_250x250.png"
  }
]

function App() {
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    let interval$ = interval(1000)
    let testSet$ = from(testSet)

    let testZip$ = zip(testSet$, interval$)
    
    testZip$.subscribe({
      next: vals=>setPosts((prev)=>{return [...prev, vals[0]]})
    })
  }, [])

  const handleSubmit = (e, query)=>{
    e.preventDefault()
    setPosts([])

    console.log("handleSubmit()..")

    console.log(query)
    const proxyUrl = 'http://localhost:3001/'
    const baseUrl = 'https://pixabay.com/api/?key=19443478-73723d2b3ab0b10dc457093b2&per_page=200&q='
    const queryUrl = baseUrl+query

    //emits json element
    const fetch$ = ajax({
      url: proxyUrl,
      method: 'POST',
      body: {
        'targetUrl': queryUrl
      }
    }).pipe(
      map(jsonRes=>jsonRes['response']['hits']),
      mergeMap(jsonElem=>from(jsonElem))
    )
    
    fetch$.subscribe({
      next: (p)=>{
        setPosts((prevPosts, currentProps)=>{
          console.log(posts.length, p['id'])
          return [...prevPosts, p]
        })
      },
      error: (err)=>console.log(err)
    })
  }

  return (
    <div className="App">
      <Header/>
      <Input handleSubmit={handleSubmit}/>
      {/* <Body buf={results} handleSubmit={handleSubmit}/> */}
      <Posts posts={posts}/>
    </div>
  );
}

export default App;

// https://pixabay.com/api/?key=19443478-73723d2b3ab0b10dc457093b2&q=yellow+flowers&image_type=photo&pretty=true