import {useState} from 'react'

const ApiInput = (props) => {

    const [queries, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [key, setKey] = useState('')
    const [animateState, setAnimateState] = useState('')

    return (
        <div className="apiInputContainer">
            <h2>Update Mongo DB</h2>
            <label className="inputGuide">
                <i>Fetch query result from api and save it onto mongo db.
                <br/>You can put multiple querie keywords like 'apple,banana,pie'</i>
            </label>

            <div><label>Base URL:</label></div>
            <div><input type="text" defaultValue="http://localhost:8080/posts" onChange={(e)=>props.setSpringBaseUrl(e.target.value)}/></div>
            <div>
                {props.springBaseUrl === '' ?
                    <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                        <i style={{color:"#E77"}}>Base url should not be empty!</i></label> : null
                }
            </div>
            <div><label>Key:</label></div>
            <div><input type="text" onChange={(e)=>setKey(e.target.value)}/></div>
            <div>
                {key===''?
                    <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                        <i style={{color:"#E77"}}> Key should not be empty! </i>
                    </label> : null
                }
            </div>

            <form onSubmit={props.handleSubmit(key, queries, page, size)}>
                <div><label>{props.guide}</label></div>
                <div><input type="text" onChange={(e)=>setQuery(e.target.value)}/></div>
                <div>
                    {queries ==='' ? 
                        <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                            <i style={{color:"#E77"}}>You can't query on nothing!</i>
                        </label> : null
                    }
                </div>

                <div><label>Page({'>'}1): </label></div>
                <div><input type="number" min="1" max="999" defaultValue="1" onChange={(e)=>setPage(e.target.value)}/></div>
                
                <div><label>Size per page(3-200): </label></div>
                <div><input type="number" min="3" max="200" defaultValue="20" onChange={(e)=>setSize(e.target.value)}/></div>
                
                <input type="radio" id="async" value="async" checked/>
                <label htmlFor="async">async</label>
                <input type="radio" id="sync" value="sync"/>
                <label htmlFor="sync">sync</label>
                
                <br/><input type="submit" value="Update and Fetch" onClick={()=>setAnimateState('bounce-in')}/>
            </form>
        </div>
        )
}

export default ApiInput