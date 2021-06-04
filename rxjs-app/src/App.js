import {useState} from 'react'
import {from, interval, Observable, zip, map} from 'rxjs'
import {ajax} from 'rxjs/ajax'
import Header from './components/Header'
import Body from './components/Body'

function App() {
  const [user, setUser] = useState()

  // useEffect(()=>{
  //   const url = 'https://randomuser.me/api/'
  //   const fetch$ = ajax.getJSON(url)

  //   fetch$.subscribe({
  //     next: (x)=>console.log(JSON.stringify(x))
  //   })
  // }, [])

  const handleSubmit = (query)=>{
    console.log("handleSubmit()..")

    const baseUrl = 'https://pixabay.com/api/?key=19443478-73723d2b3ab0b10dc457093b2&q='
    const queryUrl = baseUrl+query
    const fetch$ = ajax.getJSON(queryUrl)
    fetch$.subscribe({
      next: (x)=>console.log(JSON.stringify(x))
    })
  }

  return (
    <div className="App">
      <Header/>
      <Body buf={user} handleSubmit={handleSubmit}/>
      {/* <p>{buf}</p> */}
    </div>
  );
}

export default App;

// https://pixabay.com/api/?key=19443478-73723d2b3ab0b10dc457093b2&q=yellow+flowers&image_type=photo&pretty=true