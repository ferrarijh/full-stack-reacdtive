import {useState} from 'react'

const ApiInput = (props) => {
    const [queries, setQuery] = useState([])
    const [page, setPage] = useState(0)
    const [size, setSize] = useState(20)

    return (
        <div className="mInput">
            <text className="inputGuide"><i>Save fetched result from api to mongo db.</i></text>
            <form onSubmit={props.handleSubmit(queries, page, size)}>
                <div><label>{props.guide}</label></div>
                <div><input type="text" onChange={(e)=>setQuery(e.target.value)}/></div>

                <div><label>Page({'>'}1): </label></div>
                <div><input type="text" onChange={(e)=>setPage(e.target.value)}/></div>
                
                <div><label>Size per page(3-20): </label></div>
                <div><input type="text" onChange={(e)=>setSize(e.target.value)}/></div>
                
                <input type="submit" value={props.btnValue}/>
            </form>
        </div>
        )
}

export default ApiInput