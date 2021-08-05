import {useState} from 'react'

const ApiInput = (props) => {

    const [queries, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [key, setKey] = useState('')
    const [animateState, setAnimateState] = useState('')
    const [syncOrAsync, setSyncOrAsync] = useState('sync')
    
    const options = {
        queries: queries,
        page: page,
        size: size,
        key: key,
        syncOrAsync: syncOrAsync
    }

    return (
        <div className="apiInputContainer">
            <h2>Update Mongo DB</h2>
            <label className="inputGuide">
                <i>Fetch query result from api and save it onto mongo db.
                <br/>You can put multiple querie keywords like 'apple,banana,pie'</i>
            </label>

            <div><label>Base URL:</label></div>
            <div><input type="text" defaultValue={props.springBaseUrl} onChange={(e)=>props.setSpringBaseUrl(e.target.value)}/></div>
            <div>
                {props.springBaseUrl === '' &&
                    <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                        <i style={{color:"#E77"}}>Base url should not be empty!</i></label>
                }
            </div>
            <div><label>Key:</label></div>
            <div><input type="text" onChange={(e)=>setKey(e.target.value)}/></div>
            <div>
                {key==='' &&
                    <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                        <i style={{color:"#E77"}}> Key should not be empty! </i>
                    </label>
                }
            </div>

            <form onSubmit={props.handleSubmit(options)}>
                <div><label>{props.guide}</label></div>
                <div><input type="text" onChange={(e)=>setQuery(e.target.value)}/></div>
                <div>
                    {queries ==='' &&
                        <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                            <i style={{color:"#E77"}}>You can't query on nothing!</i>
                        </label>
                    }
                </div>

                <div><label>Page({'>'}1): </label></div>
                <div><input type="number" min="1" max="999" defaultValue="1" onChange={(e)=>setPage(e.target.value)}/></div>
                
                <div><label>Size per page(3-200): </label></div>
                <div><input type="number" min="3" max="200" defaultValue="20" onChange={(e)=>setSize(e.target.value)}/></div>
                
                <input type="radio" id="async" value="async" onClick={e=>setSyncOrAsync(e.target.value)} name="queryType" />
                <label htmlFor="async">async</label>
                <input type="radio" id="sync" value="sync" onClick={e=>setSyncOrAsync(e.target.value)} name="queryType"/>
                <label htmlFor="sync">sync</label>
                
                <br/><input type="submit" value="Update and Fetch" onClick={()=>setAnimateState('bounce-in')}/>
            </form>
        </div>
        )
}

export default ApiInput