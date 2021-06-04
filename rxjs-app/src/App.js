import {useEffect, useState} from 'react'
import {from, interval, zip} from 'rxjs'
import Header from './components/Header'
import Body from './components/Body'

function App() {
  const [buf, setBuf] = useState(0)
  
  const nums = from([1, 2, 3, 4, 5])
  const inter = interval(500)
  const numsInterval = zip(nums, inter)

  useEffect(()=>{
    numsInterval.subscribe({
      next: (vals)=>{
          console.log("n:", vals[0])
          setBuf(vals[0])
      },
      // error: err=>console.log("error:",err),
    })
  }, [])

  return (
    <div className="App">
      <Header/>
      <Body buf={buf}/>
      {/* <p>{buf}</p> */}
    </div>
  );
}

export default App;
