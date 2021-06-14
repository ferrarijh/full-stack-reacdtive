import {useState} from 'react'

const Input = (props)=>{
    const [query, setQuery] = useState('')

    return(
        <div className="mInput">
            <form onSubmit={props.handleSubmit(query)}>
                <label>{props.guide}</label>
                <input type="text" onChange={(e)=>setQuery(e.target.value)}/>
                <input type="submit" value={props.btnValue}/>
            </form>
        </div>
    )
}

export default Input