import {useState} from 'react'

const ApiInput = (props) => {

    const [queries, setQuery] = useState([])
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(20)
    const [key, setKey] = useState('')
    const [animateState, setAnimateState] = useState('')

    return (
        <div className="apiInputContainer">
            <label className="inputGuide">
                <i>Fetch query result from api and save it onto mongo db.
                <br/>You can put multiple querie keywords like 'apple,banana,pie'</i>
            </label>

            <div><label>Base URL:</label></div>
            <div><input type="text" defaultValue="http://localhost:8080/posts" onChange={(e)=>props.setSpringBaseUrl(e.target.value)}/></div>
            <div>
                {props.springBaseUrl === '' ?
                    <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                        <i style={{color:"red"}}>Base url should not be empty!</i></label> : null
                }
            </div>
            <div><label>Key:</label></div>
            <div><input type="text" onChange={(e)=>setKey(e.target.value)}/></div>
            <div>
                {key===''?
                    <label className={animateState} onAnimationEnd={()=>setAnimateState('')}>
                        <i style={{color:"red"}}> Key should not be empty! </i>
                    </label> : null
                }
            </div>

            <form onSubmit={props.handleSubmit(key, queries, page, size)}>
                <div><label>{props.guide}</label></div>
                <div><input type="text" onChange={(e)=>setQuery(e.target.value)}/>
                </div>
                    <label>{queries ==='' ? "You can't query for nothing!" : null}</label>

                <div><label>Page({'>'}1): </label></div>
                <div><input type="number" min="1" max="999" defaultValue="1" onChange={(e)=>setPage(e.target.value)}/></div>
                
                <div><label>Size per page(3-200): </label></div>
                <div><input type="number" min="3" max="200" defaultValue="20" onChange={(e)=>setSize(e.target.value)}/></div>
                
                <input type="submit" value={props.btnValue} onClick={()=>setAnimateState('bounce-in')}/>
            </form>
        </div>
        )
}

export default ApiInput