import {useState} from 'react'

const MongoInput = (props)=>{
    const [query, setQuery] = useState('')

    return(
        <div className="mInput">
            <form onSubmit={props.handleSubmit(query)}>
                <div><label>{props.guide}</label></div>
                <div><input type="text" onChange={(e)=>setQuery(e.target.value)}/></div>
                <div><input type="submit" value={props.btnValue}/></div>
            </form>
        </div>
    )
}

export default MongoInput